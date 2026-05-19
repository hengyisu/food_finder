import os
import json
import subprocess

def extract_json(text):
    """從可能含有 markdown 標籤的文字中提取 JSON"""
    text = text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[-1]
        text = text.rsplit("```", 1)[0]
    return text.strip()

def _extract_spec(response: str):
    """Return the spec string if response contains [SPEC_READY], else None."""
    if "[SPEC_READY]" not in response:
        return None
    return response.split("[SPEC_READY]", 1)[1].strip()

def load_agent_blueprint(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

def call_agent(blueprint, user_input, system_instruction_addon="", json_schema=None):
    json_instruction = ""
    if json_schema:
        json_instruction = (
            f"\n\n【重要輸出規則】你必須只輸出純 JSON，不要有任何其他文字、解釋或 markdown 標籤。"
            f"輸出必須嚴格符合此 Schema：{json.dumps(json_schema, ensure_ascii=False)}"
        )

    full_prompt = (
        f"【你的角色與規則】\n{blueprint}\n{system_instruction_addon}"
        f"{json_instruction}"
        f"\n\n【重要】不要使用任何工具，不要呼叫任何 function，直接在回覆中輸出結果。"
        f"\n\n【任務】\n{user_input}"
    )

    cmd = ["claude", "--print", "--output-format", "json", full_prompt]

    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        raise RuntimeError(f"Claude CLI 錯誤:\n{result.stderr}")

    envelope = json.loads(result.stdout)
    return envelope["result"].strip()

# --- 定義結構化輸出的 JSON Schema ---
architect_schema = {
    "type": "object",
    "properties": {
        "project_name": {"type": "string"},
        "files": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "filename": {"type": "string"},
                    "description": {"type": "string"}
                },
                "required": ["filename", "description"]
            }
        }
    },
    "required": ["project_name", "files"]
}

reviewer_schema = {
    "type": "object",
    "properties": {
        "status": {"type": "string", "enum": ["APPROVED", "REJECTED"]},
        "review_comments": {"type": "string"},
        "bugs": {
            "type": "array",
            "items": {"type": "string"}
        }
    },
    "required": ["status", "review_comments", "bugs"]
}

# --- 主工作流流程 ---
def run_automation_team(user_requirement):
    architect_bp = load_agent_blueprint("agent_blueprints/software-architect.md")
    developer_bp = load_agent_blueprint("agent_blueprints/senior-developer.md")
    reviewer_bp = load_agent_blueprint("agent_blueprints/code-reviewer.md")

    print("📐 [Step 1] 架構師正在規劃專案結構...")
    architect_addon = "請根據你的規則分析需求，輸出符合 JSON Schema 的專案檔案清單。project_name 請使用英文 snake_case。"
    architect_res = call_agent(architect_bp, user_requirement, architect_addon, json_schema=architect_schema)
    spec = json.loads(extract_json(architect_res))

    project_dir = f"./{spec['project_name']}"
    os.makedirs(project_dir, exist_ok=True)
    print(f"專案目錄已建立: {project_dir}，規劃開發 {len(spec['files'])} 個檔案。")

    for file_info in spec["files"]:
        filename = file_info["filename"]
        file_desc = file_info["description"]
        file_path = os.path.join(project_dir, filename)

        print(f"\n💻 [Step 2] 開發者開始撰寫: {filename}...")

        dev_context = f"專案總需求: {user_requirement}\n當前要開發的檔案: {filename}\n功能描述: {file_desc}"
        dev_addon = "請直接輸出完整的程式碼內容，不需要用 ```python 標籤包裹，直接給出純文字代碼。"

        max_retries = 3
        is_passed = False

        for attempt in range(max_retries):
            print(f"  執行第 {attempt + 1} 次代碼生成/修正...")
            generated_code = call_agent(developer_bp, dev_context, dev_addon)

            with open(file_path, "w", encoding="utf-8") as f:
                f.write(generated_code)

            if not filename.endswith(".py"):
                compile_check = subprocess.CompletedProcess(args=[], returncode=0)
            else:
                compile_check = subprocess.run(
                    ["python3", "-m", "py_compile", file_path],
                    capture_output=True, text=True
                )

            if compile_check.returncode != 0:
                print("  ⚠️ 語法編譯失敗！叫開發者自我修正...")
                dev_context += f"\n\n[系統回報] 你剛才寫的代碼編譯失敗，錯誤訊息如下，請修正：\n{compile_check.stderr}"
                continue

            print(f"🔍 [Step 3] 審查者開始審查: {filename}...")
            reviewer_context = f"設計規格: {file_desc}\n產出的原始碼:\n{generated_code}"
            reviewer_addon = "請根據你的審查規則評估這段代碼，輸出符合 JSON Schema 的審查報告。"

            reviewer_res = call_agent(reviewer_bp, reviewer_context, reviewer_addon, json_schema=reviewer_schema)
            review = json.loads(extract_json(reviewer_res))

            if review["status"] == "APPROVED":
                print(f"  ✅ {filename} 審查通過！")
                is_passed = True
                break
            else:
                print(f"  ❌ {filename} 被退件！原因: {review['review_comments']}")
                dev_context += f"\n\n[審查者退件] 請根據以下 Bug 列表修正代碼：\n{json.dumps(review['bugs'], ensure_ascii=False)}"

        if not is_passed:
            print(f"  🚨 {filename} 超過最大修正次數，請人類工程師介入檢查。")

if __name__ == "__main__":
    run_automation_team("幫我做一個自動化網路爬蟲，使用 Playwright 爬取指定網頁的標題與連結，並存成 CSV 檔。")
