# Brainstorming Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an interactive multi-turn brainstorming phase (Step 0) at the start of `main.py`'s automation pipeline, producing a structured design spec that replaces the raw requirement string as input to the Software Architect.

**Architecture:** A new `brainstorm_with_user()` function drives a loop — each iteration sends the growing conversation history to Claude via `call_agent()`, prints the returned question, reads user input, and repeats until Claude outputs the `[SPEC_READY]` stop signal followed by the spec markdown. The spec is saved to `docs/superpowers/specs/` and returned as a string. `run_automation_team()` calls this at Step 0 and passes `spec` (not the raw requirement) to the architect.

**Tech Stack:** Python 3, existing `call_agent()` + `load_agent_blueprint()` infrastructure, `datetime` stdlib, `pytest` for unit tests.

---

### Task 1: Create `agent_blueprints/brainstorming.md`

**Files:**
- Create: `agent_blueprints/brainstorming.md`

- [ ] **Step 1: Create the blueprint file**

```markdown
---
name: Brainstorming Agent
description: Requirements analyst that conducts multi-turn conversations to clarify requirements and produce structured design specs
---

# Brainstorming Agent

You are a **Requirements Analyst**. Your job is to help users clarify their software requirements through focused questions, then produce a structured design document.

## Your Process

1. Analyse the user's raw requirement carefully
2. Ask targeted clarifying questions one at a time — you decide how many are needed based on complexity
3. When you have enough information to design the system, output the spec

## Rules

- **One thing per response**: either ask ONE question, or output `[SPEC_READY]` followed by the spec — never both in the same response
- Questions should target decisions that affect architecture: target users, tech stack preferences, scale, constraints, integrations, non-goals
- Match the user's language (if they write in Traditional Chinese, write in Traditional Chinese)
- Do not ask about things already clear from the requirement

## When to Stop Asking

Stop when you know:
- What the system does and why
- Who uses it
- Key technical constraints or preferences
- What is explicitly out of scope

## Spec Output Format

When ready, output exactly this (start with the token on its own, then the spec):

[SPEC_READY]
# <Topic> Design

## Overview
（一句話說明這個系統是什麼、為什麼需要它）

## Architecture
（系統架構：模式選擇、主要技術決策）

## Components
（各模組職責，條列說明）

## Data Flow
（資料如何在系統中流動，可用文字描述流程）

## Error Handling
（如何處理錯誤與例外狀況）

## Testing
（如何驗證這個系統）
```

- [ ] **Step 2: Commit**

```bash
git add agent_blueprints/brainstorming.md
git commit -m "feat: add brainstorming agent blueprint"
```

---

### Task 2: Add `_extract_spec()` helper and unit tests

**Files:**
- Modify: `main.py` (add one helper function after `extract_json`)
- Create: `tests/test_brainstorm.py`

- [ ] **Step 1: Write the failing tests**

Create `tests/test_brainstorm.py`:

```python
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from main import _extract_spec


def test_extract_spec_returns_spec_when_signal_present():
    response = "[SPEC_READY]\n# My Design\n\n## Overview\nA scraper."
    result = _extract_spec(response)
    assert result == "# My Design\n\n## Overview\nA scraper."


def test_extract_spec_returns_none_when_no_signal():
    response = "這個爬蟲的目標網站有登入需求嗎？"
    result = _extract_spec(response)
    assert result is None


def test_extract_spec_strips_leading_whitespace_after_signal():
    response = "[SPEC_READY]   \n\n# Design\n## Overview\nFoo."
    result = _extract_spec(response)
    assert result == "# Design\n## Overview\nFoo."


def test_extract_spec_signal_embedded_mid_response():
    # [SPEC_READY] must appear; everything after it is the spec
    response = "some preamble [SPEC_READY]\n# Design\n## Overview\nBar."
    result = _extract_spec(response)
    assert result == "# Design\n## Overview\nBar."
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd /Users/yi/Desktop/food_finder
python -m pytest tests/test_brainstorm.py -v
```

Expected: `ImportError` — `_extract_spec` does not exist yet.

- [ ] **Step 3: Add `_extract_spec()` to `main.py`**

Add this function directly after `extract_json()` (line 11):

```python
def _extract_spec(response: str):
    """Return the spec string if response contains [SPEC_READY], else None."""
    if "[SPEC_READY]" not in response:
        return None
    return response.split("[SPEC_READY]", 1)[1].strip()
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
python -m pytest tests/test_brainstorm.py -v
```

Expected output:
```
tests/test_brainstorm.py::test_extract_spec_returns_spec_when_signal_present PASSED
tests/test_brainstorm.py::test_extract_spec_returns_none_when_no_signal PASSED
tests/test_brainstorm.py::test_extract_spec_strips_leading_whitespace_after_signal PASSED
tests/test_brainstorm.py::test_extract_spec_signal_embedded_mid_response PASSED
4 passed
```

- [ ] **Step 5: Commit**

```bash
git add main.py tests/test_brainstorm.py
git commit -m "feat: add _extract_spec helper with unit tests"
```

---

### Task 3: Add `brainstorm_with_user()` to `main.py`

**Files:**
- Modify: `main.py` (add import + new function before `run_automation_team`)

- [ ] **Step 1: Add `datetime` import at the top of `main.py`**

The current imports block (lines 1-3) is:
```python
import os
import json
import subprocess
```

Change to:
```python
import os
import json
import subprocess
from datetime import datetime
```

- [ ] **Step 2: Add `brainstorm_with_user()` to `main.py`**

Add this function directly before `run_automation_team()` (before line 76):

```python
def brainstorm_with_user(user_requirement: str) -> str:
    brainstorm_bp = load_agent_blueprint("agent_blueprints/brainstorming.md")
    history = [f"使用者需求：{user_requirement}"]
    max_turns = 20

    for _ in range(max_turns):
        full_context = "\n".join(history)
        response = call_agent(brainstorm_bp, full_context)

        spec = _extract_spec(response)
        if spec is not None:
            timestamp = datetime.now().strftime("%Y-%m-%d")
            path = f"docs/superpowers/specs/{timestamp}-project-design.md"
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, "w", encoding="utf-8") as f:
                f.write(spec)
            print(f"\n📄 Spec 已儲存至: {path}")
            return spec

        print(f"\n🧠 Brainstorming: {response}")
        user_answer = input("你的回答：").strip()
        history.append(f"Assistant: {response}")
        history.append(f"User: {user_answer}")

    raise RuntimeError("Brainstorming 超過最大輪數限制（20 輪），請重新執行。")
```

- [ ] **Step 3: Verify existing tests still pass**

```bash
python -m pytest tests/test_brainstorm.py -v
```

Expected: 4 passed (no regressions from adding the new function).

- [ ] **Step 4: Commit**

```bash
git add main.py
git commit -m "feat: add brainstorm_with_user function with max_turns guard"
```

---

### Task 4: Wire brainstorming into `run_automation_team()`

**Files:**
- Modify: `main.py:76-88` (`run_automation_team` function body)

- [ ] **Step 1: Replace the opening of `run_automation_team()`**

Current code (lines 76-88):
```python
def run_automation_team(user_requirement):
    architect_bp = load_agent_blueprint("agent_blueprints/software-architect.md")
    developer_bp = load_agent_blueprint("agent_blueprints/senior-developer.md")
    reviewer_bp = load_agent_blueprint("agent_blueprints/code-reviewer.md")

    print("📐 [Step 1] 架構師正在規劃專案結構...")
    architect_addon = "請根據你的規則分析需求，輸出符合 JSON Schema 的專案檔案清單。project_name 請使用英文 snake_case。"
    architect_res = call_agent(architect_bp, user_requirement, architect_addon, json_schema=architect_schema)
```

Replace with:
```python
def run_automation_team(user_requirement):
    architect_bp = load_agent_blueprint("agent_blueprints/software-architect.md")
    developer_bp = load_agent_blueprint("agent_blueprints/senior-developer.md")
    reviewer_bp = load_agent_blueprint("agent_blueprints/code-reviewer.md")

    print("🧠 [Step 0] Brainstorming 開始，請回答以下問題...\n")
    spec = brainstorm_with_user(user_requirement)

    print("\n📐 [Step 1] 架構師正在規劃專案結構...")
    architect_addon = "請根據你的規則分析需求，輸出符合 JSON Schema 的專案檔案清單。project_name 請使用英文 snake_case。"
    architect_res = call_agent(architect_bp, spec, architect_addon, json_schema=architect_schema)
```

The only changes are: adding Step 0 (4 lines), and changing `user_requirement` → `spec` in the `call_agent` call. Everything from `spec = json.loads(...)` onward is untouched.

- [ ] **Step 2: Verify tests still pass**

```bash
python -m pytest tests/test_brainstorm.py -v
```

Expected: 4 passed.

- [ ] **Step 3: Manual smoke test**

```bash
cd /Users/yi/Desktop/food_finder
python main.py
```

Expected interaction:
```
🧠 [Step 0] Brainstorming 開始，請回答以下問題...

🧠 Brainstorming: <Claude asks first question>
你的回答：<type your answer>

🧠 Brainstorming: <Claude asks next question or outputs spec>
...

📄 Spec 已儲存至: docs/superpowers/specs/2026-05-19-project-design.md

📐 [Step 1] 架構師正在規劃專案結構...
```

Verify:
1. `docs/superpowers/specs/2026-05-19-project-design.md` exists and contains a valid spec with all six sections (Overview, Architecture, Components, Data Flow, Error Handling, Testing)
2. The architect proceeds normally after receiving the spec
3. Developer and reviewer steps are unchanged

- [ ] **Step 4: Commit**

```bash
git add main.py
git commit -m "feat: wire brainstorming step 0 into run_automation_team"
```
