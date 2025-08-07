// named export and default export both (convenience)
export function calculateEMA(prices, period) {
  if (!prices || prices.length < period) return new Array(prices ? prices.length : 0).fill(null);

  const k = 2 / (period + 1);
  const emaArray = new Array(prices.length).fill(null);

  // First EMA value = SMA of first `period` prices (placed at index period-1)
  let sum = 0;
  for (let i = 0; i < period; i++) sum += prices[i];
  let emaPrev = sum / period;
  emaArray[period - 1] = emaPrev;

  for (let i = period; i < prices.length; i++) {
    const ema = (prices[i] - emaPrev) * k + emaPrev;
    emaArray[i] = ema;
    emaPrev = ema;
  }

  return emaArray;
}

export default calculateEMA;
