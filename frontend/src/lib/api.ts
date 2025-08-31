const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function fetchResume() {
  const r = await fetch(`${BASE}/api/resume`, { next: { revalidate: 60 } });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function chatOnce(message: string) {
  const r = await fetch(`${BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json() as Promise<{ reply: string }>;
}
