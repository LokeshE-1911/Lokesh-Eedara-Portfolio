const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:10001";

// frontend/src/lib/api.ts
async function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

export async function fetchResume() {
  // Skip fetching when building the static bundle
  if (process.env.SKIP_SSR_FETCH === '1') {
    return { basics:{name:'Lokesh Eedara', summary:''}, skills:[], work:[], projects:[], awards:[] };
  }

  const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:10001';
  const res = await fetch(`${base}/resume`, { cache: 'no-store' }); // do not also set revalidate
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
