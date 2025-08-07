const CLIENT_ID = import.meta.env.VITE_DHAN_CLIENT_ID;
const ACCESS_TOKEN = import.meta.env.VITE_DHAN_ACCESS_TOKEN;

export const fetchStockList = async () => {
  try {
    const exchanges = ["NSE", "BSE"];
    let all = [];

    for (const ex of exchanges) {
      const url = `https://api.dhan.co/instruments/master/${ex}`;
      const res = await fetch(url, {
        headers: {
          "access-token": ACCESS_TOKEN,
          "client-id": CLIENT_ID,
        },
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error(`fetchStockList ${ex} error:`, res.status, txt);
        continue;
      }

      const ct = res.headers.get("content-type") || "";

      if (ct.includes("json")) {
        const body = await res.json();
        if (Array.isArray(body)) {
          const mapped = body.map(item => ({
            symbol: item.instrument_token || item.symbol || item.symbol,
            name: item.name || item.trading_symbol || item.instrument_name || "",
            exchange: ex,
          }));
          all.push(...mapped);
        }
      } else {
        const text = await res.text();
        const rows = text.split("\n").map(r => r.trim()).filter(Boolean);
        const dataRows = rows.slice(1);
        const mapped = dataRows.map(r => {
          const cols = r.split(",");
          return {
            symbol: cols[0],
            name: cols[1] || "",
            exchange: ex,
          };
        });
        all.push(...mapped);
      }
    }

    const uniq = [];
    const seen = new Set();
    for (const s of all) {
      if (!s.symbol) continue;
      const key = `${s.symbol}__${s.exchange}`;
      if (seen.has(key)) continue;
      seen.add(key);
      uniq.push(s);
    }

    return uniq;
  } catch (err) {
    console.error("Error fetching stock list:", err);
    return [];
  }
};

export default fetchStockList;
