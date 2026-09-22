import { get } from "@vercel/blob";

const EMPTY = { overrides: {}, additions: [], deleted: [], settings: {} };

// Only the two fields the storefront needs; internal bookkeeping stays private.
function publicSettings(settings) {
  const s = settings && typeof settings === "object" ? settings : {};
  return { whatsapp: String(s.whatsapp || ""), email: String(s.email || "") };
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  // Cached briefly at the edge so a repeat visit does not pay for a function call.
  // The browser always revalidates (an admin edit must show up at once); the edge
  // still absorbs the traffic.
  res.setHeader("Cache-Control", "public, max-age=0, must-revalidate, s-maxage=30, stale-while-revalidate=60");
  try {
    const blob = await get("data/store-state.json", { access: "private", useCache: false });
    if (!blob) return res.status(200).json(EMPTY);
    const state = JSON.parse(await new Response(blob.stream).text());
    const deleted = (Array.isArray(state.deleted) ? state.deleted : []).map(Number).filter(Boolean);
    const hidden = new Set(deleted);
    const overrides = {};
    Object.entries(state.overrides && typeof state.overrides === "object" ? state.overrides : {})
      .forEach(([id, value]) => { if (!hidden.has(Number(id))) overrides[id] = value; });
    return res.status(200).json({
      overrides,
      // A product the owner deleted must not stay readable here.
      additions: (Array.isArray(state.additions) ? state.additions : []).filter(x => !hidden.has(Number(x && x.id))),
      deleted,
      settings: publicSettings(state.settings)
    });
  } catch (e) {
    // The storefront falls back to the default catalog when this fails.
    console.error("products api error", e);
    return res.status(503).json({ error: "Store data unavailable" });
  }
}
