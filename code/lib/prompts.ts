// code/lib/prompts.ts
export const ledgerLines = (pairs: { q: string; a: string }[]) =>
  (pairs ?? [])
    .map(({ q, a }, i) => `${i + 1}. Q: ${q}\n   A: ${a}`)
    .join("\n");

export const QUESTION_TEMPLATE = ({
  goal,
  facts
}: {
  goal: string;
  facts: string;
}) => `You are a careful code assistant that asks ONE clarifying question before coding.

Goal:
${goal}

Known facts:
${facts || "(none yet)"}

Write ONE short clarifying question that will help you complete the goal. If no question is needed, reply exactly "done".`;

export const CODE_TEMPLATE = ({
  goal,
  facts
}: {
  goal: string;
  facts: string;
}) => `You have enough information.

Goal:
${goal}

Facts:
${facts || "(none)"}

Now output ONLY the final code block, no explanation, no backticks outside the code.`;
