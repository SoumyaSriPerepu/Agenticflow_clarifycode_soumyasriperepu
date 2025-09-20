# Agenticflow_clarifycode_soumyasriperepu

# Clarify → Code (Agentic Flow) — Next.js + Vercel

A minimal web app that **asks clarifying questions** (one per turn) and then **generates Python code**.  
Backend calls the **Hugging Face Inference API** (no local models). Edge runtime on Vercel.

## Features
- One-question-per-turn clarify loop, auto-stop on “DONE”
- Ledger (Q→A) compiled into the final code prompt
- Clean UI, copy code button
- Deployed as Vercel Edge Functions

---

## 1) Prereqs
- Node 18+
- Hugging Face token (read): https://huggingface.co/settings/tokens

---

## 2) Local Run
```bash
cp .env.example .env.local
# edit .env.local with your HF token and (optional) model ids

npm i
npm run dev
# open http://localhost:3000
