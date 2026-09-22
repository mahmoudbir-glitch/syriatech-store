import { get } from "@vercel/blob";

const EMPTY = { overrides: {}, additions: [], deleted: [], settings: {} };

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  res.setHeader("Cache-Control", "no-store");
  try {
    const blob = await get("data/store-state.json", { access: "private", useCache: false });
    if (!blob) return res.status(200).json(EMPTY);
    const state = JSON.parse(await new Response(blob.stream).text());
    return res.status(200).json({
      overrides: state.overrides && typeof state.overrides === "object" ? state.overrides : {},
      additions: Array.isArray(state.additions) ? state.additions : [],
      deleted: Array.isArray(state.deleted) ? state.deleted : [],
      settings: state.settings && typeof state.settings === "object" ? state.settings : {}
    });
  } catch (e) {
    // The storefront falls back to the default catalog when this fails.
    console.error("products api error", e);
    return res.status(503).json({ error: "Store data unavailable" });
  }
}
