export interface AiKeyInfo { key: string; model: string; }

const KEY_STORAGE = "horsebow.openrouter.key";
const MODEL_STORAGE = "horsebow.openrouter.model";
export const DEFAULT_MODEL = "openrouter/free";
export const BASE_URL = "https://openrouter.ai/api/v1";

export function getAiKey(): AiKeyInfo {
  if (typeof window === "undefined") return { key: "", model: DEFAULT_MODEL };
  return { key: window.localStorage.getItem(KEY_STORAGE) ?? "", model: window.localStorage.getItem(MODEL_STORAGE) ?? DEFAULT_MODEL };
}

export function setAiKey(key: string, model: string = DEFAULT_MODEL) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY_STORAGE, key);
  window.localStorage.setItem(MODEL_STORAGE, model);
}

export function clearAiKey() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY_STORAGE);
  window.localStorage.removeItem(MODEL_STORAGE);
}

export interface ChatMessage { role: "system" | "user" | "assistant"; content: string; }
export interface ChatRequest { key: string; model: string; messages: ChatMessage[]; stream?: boolean; signal?: AbortSignal; }

export async function* streamChat(req: ChatRequest): AsyncGenerator<string, void, void> {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${req.key}`,
      "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "https://horsebow.app",
      "X-Title": "Horsebow Scoring PWA",
    },
    body: JSON.stringify({ model: req.model, messages: req.messages, stream: true }),
    signal: req.signal,
  });
  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, idx).trim();
      buffer = buffer.slice(idx + 1);
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const json = JSON.parse(data) as { choices?: { delta?: { content?: string } }[] };
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch { /* ignore parse errors */ }
    }
  }
}
