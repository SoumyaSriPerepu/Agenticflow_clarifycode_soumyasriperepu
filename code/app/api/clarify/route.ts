import { NextRequest } from "next/server";
import { generateText, stripEcho } from "@/lib/hf";
import { QUESTION_TEMPLATE, ledgerLines } from "@/lib/prompts";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { goal, ledger } = (await req.json()) as {
      goal: string;
      ledger: { q: string; a: string }[];
    };

    if (!goal || typeof goal !== "string") {
      return Response.json({ error: "Missing goal" }, { status: 400 });
    }

    const prompt = QUESTION_TEMPLATE({ goal, facts: ledgerLines(ledger || []) });
    const model = process.env.HF_QUESTION_MODEL || process.env.HF_CODE_MODEL || "mistralai/Mistral-7B-Instruct-v0.3";

    const out = await generateText(model, prompt, {
      max_new_tokens: 96,
      temperature: 0.2,
      top_p: 0.9
    });

    const reply = stripEcho(prompt, out).trim();

    if (/^done\.?$/i.test(reply)) {
      return Response.json({ status: "done" });
    }

    // Ensure it's a single, short question (best-effort trim)
    const oneLine = reply.split(/\n/)[0].trim();
    return Response.json({ status: "question", question: oneLine });
  } catch (e: any) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
