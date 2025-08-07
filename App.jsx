import React, { useEffect, useState } from "react";
import stockList from "./stockList";
import scanStocks from "./scanStocks";

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastScan, setLastScan] = useState(null);

  const runScan = async () => {
    setLoading(true);
    try {
      const res = await scanStocks(stockList, { interval: "5m", limit: 200, period: 21 });
      setResults(res);
      setLastScan(new Date().toISOString());
    } catch (err) {
      console.error("scan error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runScan();
    const id = setInterval(runScan, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ padding: 16, fontFamily: "Inter, Arial, sans-serif" }}>
      <h1>EMA 21 Screener (5m)</h1>
      <p style={{ fontSize: 13, color: "#666" }}>
        Last scan: {lastScan ? new Date(lastScan).toLocaleString() : "—"}
      </p>

      {loading ? (
        <p>Scanning stocks…</p>
      ) : results.length > 0 ? (
        <ul>
          {results.map((r, i) => (
            <li key={i}>
              {r.symbol} ({r.exchange}) —{" "}
              <span style={{ color: r.direction === "bullish" ? "green" : "red", fontWeight: 600 }}>
                {r.direction.toUpperCase()}
              </span>{" "}
              {r.lastTimestamp ? ` @ ${r.lastTimestamp}` : ""}
            </li>
          ))}
        </ul>
      ) : (
        <p>No signals found.</p>
      )}
    </div>
  );
}

export default App;
