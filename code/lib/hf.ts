// code/lib/hf.ts
type GenOpts = {
  max_new_tokens?: number;
  temperature?: number;
  top_p?: number;
};

const HF_URL = (model: string) =>
  `https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`;

export async function generateText(model: string, prompt: string, opts: GenOpts = {}) {
  const token = process.env.HF_TOKEN;
  if (!token) throw new Error("Missing HF_TOKEN env var");

  const res = await fetch(HF_URL(model), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: opts.max_new_tokens ?? 128,
        temperature: opts.temperature ?? 0.2,
        top_p: opts.top_p ?? 0.9,
        return_full_text: false
      }
    })
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`HF API error (${res.status}): ${t}`);
  }

  const data = (await res.json()) as Array<{ generated_text: string }>;
  return (data?.[0]?.generated_text ?? "").toString();
}

export const stripEcho = (prompt: string, out: string) =>
  out.startsWith(prompt) ? out.slice(prompt.length) : out;
