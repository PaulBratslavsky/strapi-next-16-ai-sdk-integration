const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api/ai-sdk";

// Simple fetch wrapper
export async function askAI(prompt: string, options?: { system?: string }) {
  const res = await fetch(`${API_BASE}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, ...options }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const data = await res.json();
  return data.data?.text as string;
}

export async function askStreamAI(
  prompt: string,
  options?: { system?: string }
): Promise<Response> {
  const res = await fetch(`${API_BASE}/ask-stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, ...options }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res;
}

export { API_BASE };