import getCandles from "./getCandles";
import checkCrossover from "./checkCrossover";

const scanStocks = async (stockList = [], opts = {}) => {
  const { interval = "5m", limit = 100, period = 21 } = opts;
  const results = [];

  for (const s of stockList) {
    try {
      const symbol = s.symbol || s;
      const exchange = s.exchange || "NSE";
      console.log(`Scanning ${symbol} (${exchange})`);
      const candles = await getCandles(symbol, exchange, interval, limit);

      if (!candles || candles.length < period + 3) continue;

      const signal = checkCrossover(candles, period);
      if (signal) {
        results.push({
          symbol,
          exchange,
          direction: signal,
          lastTimestamp: candles[candles.length - 1]?.timestamp,
        });
      }
    } catch (err) {
      console.error(`Error scanning ${s.symbol || s}:`, err);
    }
  }

  return results;
};

export default scanStocks;
