// Vercel serverless function: proxies streak SVG to your domain
export default async function handler(req: any, res: any) {
  try {
    const qs = req.url.includes("?") ? req.url.split("?")[1] : "";
    const target = `https://streak-stats.demolab.com/?${qs}`;

    const r = await fetch(target, {
      headers: { "User-Agent": "Vercel-Streak-Proxy" },
      next: { revalidate: 3600 }, // enable caching on Vercel edges
    });

    const svg = await r.text();
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    // cache 1h at the edge; allow stale while revalidating
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    res.status(r.status).send(svg);
  } catch (err: any) {
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.status(500).send(
      `<svg xmlns="http://www.w3.org/2000/svg" width="495" height="195">
        <rect width="100%" height="100%" fill="#1a1b27"/>
        <text x="20" y="40" fill="#e06c75" font-size="16" font-family="Verdana">Streak proxy error</text>
        <text x="20" y="70" fill="#c0c0c0" font-size="12" font-family="Verdana">${String(err?.message ?? "Unknown error")}</text>
      </svg>`
    );
  }
}
