import { NextRequest } from "next/server";
import { generateText, stripEcho, extractCode } from "@/lib/hf";
import { CODE_TEMPLATE, ledgerLines } from "@/lib/prompts";

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

    const prompt = CODE_TEMPLATE({ goal, facts: ledgerLines(ledger || []) });
    const model = process.env.HF_CODE_MODEL || "mistralai/Mistral-7B-Instruct-v0.3";

    const raw = await generateText(model, prompt, {
      max_new_tokens: 300,
      temperature: 0.1,
      top_p: 0.9
    });

    const trimmed = stripEcho(prompt, raw);
    const code = extractCode(trimmed);
    return Response.json({ code });
  } catch (e: any) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
