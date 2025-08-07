import { fetchStockList } from "./fetchStockList";

export const saveStockListLocally = async () => {
  const stocks = await fetchStockList();
  const equity = stocks.filter(s => s.symbol && s.symbol.length > 0);

  const blob = new Blob([JSON.stringify(equity, null, 2)], {
    type: "application/json"
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "dhan_stock_list.json";
  a.click();
};
