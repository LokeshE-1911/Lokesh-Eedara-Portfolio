const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:10001";

// frontend/src/lib/api.ts
// frontend/src/lib/api.ts
export async function fetchResume() {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL!;
  const res = await fetch(`${base}/resume`, { cache: "no-store" }); // note: no revalidate
  if (!res.ok) throw new Error(`Resume fetch failed: ${res.status}`);
  return res.json();
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
