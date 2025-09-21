// code/lib/prompts.ts
export const ledgerLines = (pairs: { q: string; a: string }[]) =>
  pairs
    .filter(Boolean)
    .map(({ q, a }, i) => `${i + 1}. Q: ${q}\n   A: ${a}`)
    .join("\n");

export const QUESTION_TEMPLATE = ({
  goal,
  facts
}: {
  goal: string;
  facts: string;
}) => `You are a careful code assistant that asks clarifying questions before coding.

Goal:
${goal}

Known facts:
${facts || "(none yet)"}

Write ONE short clarifying question that will help you complete the goal. If no question is needed, reply "done".`;

export const CODE_TEMPLATE = ({
  goal,
  facts
}: {
  goal: string;
  facts: string;
}) => `You have gathered the required details.

Goal:
${goal}

Facts:
${facts || "(none)"}

Now produce the FINAL code block only. Do not include explanations.`;
