const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:10001";

// frontend/src/lib/api.ts
async function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

export async function fetchResume() {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:10001";
  const url = `${base}/resume`;

  const max = 6;               // ~6 seconds total
  for (let i = 0; i < max; i++) {
    try {
      const res = await fetch(url, { cache: "no-store" }); // only ONE cache option
      if (res.ok) return res.json();
      // if backend is up but no route, surface clear error
      throw new Error(`Resume fetch failed: ${res.status}`);
    } catch (err) {
      if (i === max - 1) throw err;   // give up after retries
      await sleep(1000);
    }
  }
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
