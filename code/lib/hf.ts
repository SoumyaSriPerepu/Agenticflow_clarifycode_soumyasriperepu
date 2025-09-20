export type GenParams = {
  max_new_tokens?: number;
  temperature?: number;
  top_p?: number;
};

const HF_ENDPOINT = "https://api-inference.huggingface.co/models";

const getToken = () => {
  const t = process.env.HUGGINGFACE_TOKEN;
  if (!t) throw new Error("Missing HUGGINGFACE_TOKEN");
  return t;
};

export async function generateText(
  model: string,
  prompt: string,
  params: GenParams
): Promise<string> {
  const res = await fetch(`${HF_ENDPOINT}/${encodeURIComponent(model)}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: params.max_new_tokens ?? 256,
        temperature: params.temperature ?? 0.2,
        top_p: params.top_p ?? 0.9,
        return_full_text: true
      }
    }),
    // Edge runtime ok
    cache: "no-store"
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HF error (${res.status}): ${text}`);
  }

  // Typical HF JSON: [{ generated_text: "..." }]
  const json = await res.json();
  if (Array.isArray(json) && json.length && json[0].generated_text) {
    return String(json[0].generated_text);
  }
  // Some models return string directly
  if (typeof json === "string") return json;
  // Fallback: stringify
  return JSON.stringify(json);
}

export function stripEcho(prompt: string, out: string) {
  return out.startsWith(prompt) ? out.slice(prompt.length) : out;
}

export function extractCode(raw: string): string {
  const m = raw.match(/```(?:python)?\s*([\s\S]*?)```/i);
  return (m ? m[1] : raw).trim();
}
