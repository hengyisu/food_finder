# Workflow Redesign Design

## Overview

Extend `main.py` to add an interactive brainstorming phase at the start of the automation pipeline. Before the software architect receives any input, a multi-turn CLI conversation collects and refines the user's raw requirement into a structured design spec. The spec is saved to disk and passed downstream to replace the raw requirement string throughout the rest of the pipeline.

## Architecture

Four-stage sequential pipeline:

```
User Input (raw requirement)
       ↓
[Step 0] Brainstorming Agent  ←── multi-turn CLI conversation
       ↓ spec (markdown string + saved .md file)
[Step 1] Software Architect   ←── unchanged, receives spec instead of raw requirement
       ↓ JSON: project_name + files[]
[Step 2] Senior Developer     ←── unchanged, per-file with retry loop (max 3)
       ↓ generated code
[Step 3] Code Reviewer        ←── unchanged, APPROVED / REJECTED
```

## Components

### `agent_blueprints/brainstorming.md` (new)
Blueprint for the brainstorming agent. Instructs Claude to:
- Ask clarifying questions one at a time, self-determining how many are needed
- Output `[SPEC_READY]` followed by a complete design doc when it has sufficient information
- Never output a question and `[SPEC_READY]` in the same response
- Match the language of the conversation (Traditional Chinese if user replies in Chinese)

### `brainstorm_with_user(user_requirement: str) -> str` (new function in `main.py`)
Drives the multi-turn conversation loop:
1. Initialises history with the user's raw requirement
2. Calls `call_agent(brainstorm_bp, full_context)` each turn
3. If response contains `[SPEC_READY]`: extracts spec, saves to disk, returns spec string
4. Otherwise: prints question, reads user input via `input()`, appends both to history, loops

### `run_automation_team(user_requirement: str)` (modified)
- Adds Step 0 at the top: calls `brainstorm_with_user()` to obtain `spec`
- Passes `spec` to the architect `call_agent()` instead of `user_requirement`
- Steps 1–3 remain structurally unchanged

## Data Flow

```
user_requirement (str)
  → brainstorm_with_user()
      → history list grows each turn: ["使用者需求: ...", "Assistant: Q1", "User: A1", ...]
      → call_agent(brainstorm_bp, "\n".join(history))
      → loop until [SPEC_READY] detected
  → spec (str, markdown)
      → saved to docs/superpowers/specs/YYYY-MM-DD-project-design.md
      → returned to run_automation_team()
  → call_agent(architect_bp, spec, ...)
      → architect_schema JSON
  → per-file loop (developer → reviewer)
```

## Error Handling

- `call_agent()` already raises `RuntimeError` on non-zero Claude CLI exit code — no change needed
- If the brainstorming agent never outputs `[SPEC_READY]` (e.g. model error or truncation): the while-loop would run indefinitely. Mitigation: add a `max_turns` guard (e.g. 20) that raises a clear error and exits gracefully.
- Spec file directory is created with `os.makedirs(..., exist_ok=True)` before writing.

## Testing

- **Manual smoke test**: run `python main.py`, answer 2–3 brainstorming questions, verify spec file is created and formatted correctly, verify architect receives the spec content (add a temporary `print(spec)` to confirm).
- **Stop-signal test**: craft a brainstorming blueprint response that starts with `[SPEC_READY]` and verify the loop exits correctly and the spec is parsed without the token.
- **Regression**: existing Step 1–3 behaviour should be identical to current `main.py` after the brainstorming step completes.
