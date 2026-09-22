import { get } from "@vercel/blob";

const EMPTY = { overrides: {}, additions: [], deleted: [], settings: {} };

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  // Cached briefly at the edge so a repeat visit does not pay for a function call.
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=30, stale-while-revalidate=300");
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
      settings: state.settings && typeof state.settings === "object" ? state.settings : {}
    });
  } catch (e) {
    // The storefront falls back to the default catalog when this fails.
    console.error("products api error", e);
    return res.status(503).json({ error: "Store data unavailable" });
  }
}
