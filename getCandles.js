const CLIENT_ID = import.meta.env.VITE_DHAN_CLIENT_ID;
const ACCESS_TOKEN = import.meta.env.VITE_DHAN_ACCESS_TOKEN;

async function parseCsvToCandles(text) {
  const lines = text.trim().split("\n").map(l => l.trim()).filter(Boolean);
  if (lines.length <= 1) return [];
  const header = lines[0].split(",").map(h => h.trim().toLowerCase());
  const rows = lines.slice(1);

  const candles = rows.map(row => {
    const cols = row.split(",").map(c => c.trim());
    const obj = {};
    header.forEach((h, i) => {
      obj[h] = cols[i];
    });
    return {
      timestamp: obj.timestamp || obj.time || obj.date,
      open: Number(obj.open),
      high: Number(obj.high),
      low: Number(obj.low),
      close: Number(obj.close),
      volume: obj.volume ? Number(obj.volume) : undefined,
    };
  });

  return candles;
}

const getCandles = async (symbol, exchange = "NSE", interval = "5m", limit = 200) => {
  const exchangeSegment = exchange === "BSE" ? "BSE_EQ" : "NSE_EQ";
  const url = `https://api.dhan.co/market/v1/instruments/intraday/${exchangeSegment}/${encodeURIComponent(symbol)}?interval=${interval}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "access-token": ACCESS_TOKEN,
        "client-id": CLIENT_ID,
      },
    });

    const contentType = res.headers.get("content-type") || "";

    if (!res.ok) {
      const txt = await res.text();
      console.error("getCandles non-ok response:", res.status, txt);
      return [];
    }

    if (contentType.includes("json")) {
      const body = await res.json();
      const raw = body?.data || body?.candles || body;
      if (!raw || !Array.isArray(raw)) return [];
      return raw.map(r => ({
        timestamp: r.t || r.timestamp || r.time || r.datetime,
        open: Number(r.o ?? r.open),
        high: Number(r.h ?? r.high),
        low: Number(r.l ?? r.low),
        close: Number(r.c ?? r.close),
        volume: r.v ?? r.volume,
      }));
    } else {
      const text = await res.text();
      const candles = await parseCsvToCandles(text);
      return candles;
    }
  } catch (err) {
    console.error("Error in getCandles:", err);
    return [];
  }
};

export default getCandles;
