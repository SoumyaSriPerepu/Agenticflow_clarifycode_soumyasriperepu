// code/app/api/code/route.ts
import { NextRequest } from "next/server";
import { generateText, stripEcho } from "@/lib/hf";
import { CODE_TEMPLATE, ledgerLines } from "@/lib/prompts";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { goal, ledger } = (await req.json()) as {
    goal: string;
    ledger: { q: string; a: string }[];
  };
  const prompt = CODE_TEMPLATE({ goal, facts: ledgerLines(ledger || []) });
  const model =
    process.env.HF_CODE_MODEL ||
    process.env.HF_QUESTION_MODEL ||
    "mistralai/Mistral-7B-Instruct-v0.3";

  const out = await generateText(model, prompt, {
    max_new_tokens: 512,
    temperature: 0.1,
    top_p: 0.9
  });

  return Response.json({ code: stripEcho(prompt, out).trim() });
}
