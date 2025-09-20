# AGENTIC_FLOW.md
# Agentic Flow for Clarification-First Code Generation

> A practical, implementation-ready design for an agent that **asks one high-value clarifying question at a time**, then synthesizes code once the task is sufficiently specified. Drop this in your repo as the canonical reference for the flow.

---

## 0) Design Goals

- **Clarity before code**: reduce ambiguity with minimal user burden.
- **Deterministic finish**: clear stop rule (`DONE`) → synthesize once.
- **Safety by default**: sandboxed execution, import allowlist.
- **Simple to wire**: works with any chat/code LLM (local or API).

---

## 1) High-Level Loop

```text
User Goal  ──► [Q-Selector] ──► Q1 ──► User A1
                 ▲                         │
                 │                         ▼
             State/Memory ◄────────────── Update
                 │
                 ├── if "enough info" → DONE
                 ▼
            [Code Synthesizer] ──► Code
                 │
            [Verification] ──► Pass → Return
                        └──► Fail → (optional) Repair/Ask
