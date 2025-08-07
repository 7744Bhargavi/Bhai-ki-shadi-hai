import { calculateEMA } from "./emaCalculator";

function checkCrossover(candles, period = 21) {
  if (!candles || candles.length < period + 3) return null; 

  const closes = candles.map(c => Number(c.close));
  const ema = calculateEMA(closes, period);

  const lastIndex = candles.length - 1;
  const prevIndex = lastIndex - 1;

  const lastClose = Number(closes[lastIndex]);
  const prevClose = Number(closes[prevIndex]);

  const lastEMA = ema[lastIndex];
  const prevEMA = ema[prevIndex];

  if (lastEMA == null || prevEMA == null) return null;

  const isGreen = (c) => Number(c.close) > Number(c.open);
  const isRed = (c) => Number(c.close) < Number(c.open);

  const threeBeforeIndex = lastIndex - 3;
  if (threeBeforeIndex < 0) return null;
  const candle3Before = candles[threeBeforeIndex];

  if (prevClose < prevEMA && lastClose > lastEMA) {
    if (isRed(candle3Before)) return "bullish";
    return null;
  }

  if (prevClose > prevEMA && lastClose < lastEMA) {
    if (isGreen(candle3Before)) return "bearish";
    return null;
  }

  return null;
}

export default checkCrossover;
