export const SYSTEM_Q = `You are ClarifyFlow: ask concise, high-signal clarifying questions before writing code.
- Ask exactly ONE question per turn.
- Prefer closed or minimally open questions that pin constraints (ranges, formats, resources).
- Stop asking when enough info is present; then reply with DONE.
- Keep questions under 120 chars.`;

export const QUESTION_TEMPLATE = ({
  goal,
  facts
}: { goal: string; facts: string[] }) => `
${SYSTEM_Q}

User goal: ${goal.trim()}

Context so far:
${facts.length ? facts.map(f => `- ${f}`).join("\n") : "- (no answers yet)"}

Now, ask exactly ONE best clarifying question.
If enough detail, reply exactly: DONE
Your reply:
`.trim();

export const CODE_TEMPLATE = ({
  goal,
  facts
}: { goal: string; facts: string[] }) => `
You are ClarifyFlow: generate minimal, robust Python code for the user's goal.

Goal:
${goal.trim()}

Confirmed details:
${facts.length ? facts.map(f => `- ${f}`).join("\n") : "- (no answers yet)"}

Requirements:
- Output only a Python code block with no extra commentary.
- Keep it minimal but readable with short inline comments.
- No network or filesystem access.

Python code only:
`.trim();

// Utility to build "Q -> A" lines for the ledger
export const ledgerLines = (pairs: { q: string; a: string }[]) =>
  pairs.map(p => `${p.q.trim()} -> ${p.a.trim()}`);
