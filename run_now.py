"""
臨時執行腳本：跳過互動式 brainstorming，直接用預設 spec 跑 pipeline。
需求：MariaDB CRUD API（Java / Spring Boot）
"""
import os, json, subprocess
from main import (
    load_agent_blueprint, call_agent, extract_json,
    architect_schema, reviewer_schema
)

SPEC = """
# MariaDB CRUD API Design — `iac_vm_cluster_mapping`

## Overview
以 Spring Boot 建立一組 RESTful API，對 MariaDB 中的 `iac_vm_cluster_mapping` 資料表進行完整的 CRUD 操作，主鍵為 `fab + phase` 複合主鍵。

## Architecture
- **框架**：Spring Boot 3.x
- **資料存取**：Spring Data JPA（Hibernate）+ MariaDB JDBC Driver
- **API 風格**：RESTful，JSON 格式
- **模式**：Controller → Service → Repository 三層架構

## Components

- **Entity (`IacVmClusterMapping`)**
  - 欄位：`fab`（String）、`phase`（String）、`fz`（String）、`cluster`（String）
  - 複合主鍵：使用 `@EmbeddedId` 搭配 `IacVmClusterMappingId`（fab + phase）

- **Composite Key Class (`IacVmClusterMappingId`)**
  - 實作 `Serializable`，包含 `fab`、`phase` 兩個欄位

- **Repository (`IacVmClusterMappingRepository`)**
  - 繼承 `JpaRepository<IacVmClusterMapping, IacVmClusterMappingId>`

- **Service (`IacVmClusterMappingService`)**
  - 封裝 CRUD 業務邏輯，處理 Not Found 例外

- **Controller (`IacVmClusterMappingController`)**
  - 提供以下端點：

| Method | Endpoint | 說明 |
|--------|----------|------|
| GET | `/api/iac-vm-cluster-mappings` | 取得全部 |
| GET | `/api/iac-vm-cluster-mappings/{fab}/{phase}` | 依複合主鍵取得單筆 |
| POST | `/api/iac-vm-cluster-mappings` | 新增 |
| PUT | `/api/iac-vm-cluster-mappings/{fab}/{phase}` | 更新 |
| DELETE | `/api/iac-vm-cluster-mappings/{fab}/{phase}` | 刪除 |

## Data Flow

1. Client 送出 HTTP Request
2. Controller 解析路徑參數與 Request Body，組成 DTO 或 Entity
3. Service 呼叫 Repository 執行資料庫操作
4. Repository 透過 JPA 對 MariaDB 進行 SQL 操作
5. 結果逐層回傳，Controller 回應 HTTP Response（JSON）

## Error Handling

- 查詢或更新不存在的主鍵 → 回傳 `404 Not Found`（自定義 `ResourceNotFoundException`）
- 新增重複主鍵 → 捕捉 `DataIntegrityViolationException` → 回傳 `409 Conflict`
- 其他未預期錯誤 → 全域 `@RestControllerAdvice` 統一回傳 `500 Internal Server Error`

## Testing

- **單元測試**：用 JUnit 5 + Mockito 測試 Service 層邏輯
- **整合測試**：用 `@SpringBootTest` + H2（或 Testcontainers MariaDB）測試完整請求流程
- **手動測試**：整合 Springdoc OpenAPI（Swagger UI），可直接在瀏覽器測試各端點
"""

def run_pipeline(spec: str):
    architect_bp = load_agent_blueprint("agent_blueprints/software-architect.md")
    developer_bp = load_agent_blueprint("agent_blueprints/senior-developer.md")
    reviewer_bp  = load_agent_blueprint("agent_blueprints/code-reviewer.md")

    print("📐 [Step 1] 架構師正在規劃專案結構...")
    architect_addon = "請根據你的規則分析需求，輸出符合 JSON Schema 的專案檔案清單。project_name 請使用英文 snake_case。"
    architect_res = call_agent(architect_bp, spec, architect_addon, json_schema=architect_schema)
    project_spec = json.loads(extract_json(architect_res))

    project_dir = f"./{project_spec['project_name']}"
    os.makedirs(project_dir, exist_ok=True)
    print(f"專案目錄已建立: {project_dir}，規劃開發 {len(project_spec['files'])} 個檔案。")

    for file_info in project_spec["files"]:
        filename = file_info["filename"]
        file_desc = file_info["description"]
        file_path = os.path.join(project_dir, filename)

        # 建立子目錄（Java package 結構需要）
        os.makedirs(os.path.dirname(file_path), exist_ok=True) if os.path.dirname(file_path) else None

        print(f"\n💻 [Step 2] 開發者開始撰寫: {filename}...")
        dev_context = f"專案總需求（設計規格）:\n{spec}\n\n當前要開發的檔案: {filename}\n功能描述: {file_desc}"
        dev_addon = "請直接輸出完整的程式碼內容，不需要用任何 markdown 標籤包裹，直接給出純文字代碼。"

        max_retries = 3
        is_passed = False

        for attempt in range(max_retries):
            print(f"  執行第 {attempt + 1} 次代碼生成...")
            generated_code = call_agent(developer_bp, dev_context, dev_addon)

            with open(file_path, "w", encoding="utf-8") as f:
                f.write(generated_code)

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
    run_pipeline(SPEC)
