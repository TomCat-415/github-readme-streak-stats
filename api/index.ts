// api/index.ts

export default async function handler(req: any, res: any) {
  try {
    // Get the query string safely
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    const qs = url.searchParams.toString();
    const target = `https://streak-stats.demolab.com/?${qs}`;

    const r = await fetch(target, {
      headers: { "User-Agent": "Vercel-Streak-Proxy" },
    });

    const svg = await r.text();

    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    res.status(r.status).send(svg);
  } catch (err: any) {
    const message = err?.message ?? "Unknown error";
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.status(500).send(
      `<svg xmlns="http://www.w3.org/2000/svg" width="495" height="195">
        <rect width="100%" height="100%" fill="#1a1b27"/>
        <text x="20" y="40" fill="#e06c75" font-size="16" font-family="Verdana">Streak proxy error</text>
        <text x="20" y="70" fill="#c0c0c0" font-size="12" font-family="Verdana">${message}</text>
      </svg>`
    );
  }
}
