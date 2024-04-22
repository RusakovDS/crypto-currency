import { QueryKey } from "@tanstack/react-query";
import axios from "axios";
import { generateKey } from "crypto";
import generateId from "../utils/generateId";

export interface Coin {
  id: string; // "bitcoin",
  symbol: string; //"btc",
  name: string; //"Bitcoin",
  image: string; //"https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
  current_price: number; //21833,
  market_cap: number; //421543304770,
  market_cap_rank: number; //1,
  fully_diluted_valuation: number; //458899517378,
  total_volume: number; //32674031120,
  high_24h: number; //21861,
  low_24h: number; //21471,
  price_change_24h: number; //295.29,
  price_change_percentage_24h: number; //1.37106,
  market_cap_change_24h: number; //5887928195,
  market_cap_change_percentage_24h: number; //1.41654,
  circulating_supply: number; //19290518,
  total_supply: number; //21000000,
  max_supply: number; //21000000,
  ath: number; //69045,
  ath_change_percentage: number; //-68.35045,
  ath_date: string; //"2021-11-10T14:24:11.849Z",
  atl: number; //67.81,
  atl_change_percentage: number; //32126.33864,
  atl_date: string; //"2013-07-06T00:00:00.000Z",
  roi: any;
  last_updated: string; //"2023-02-14T10:43:59.903Z"
}

export interface ServerError {
  status: {
    error_code: number;
    error_message: string;
  };
}

const api = axios.create({
  baseURL: "https://api.coingecko.com/api/v3/",
  headers: {
    "Content-type": "application/json",
  },
});

export const getCoins = async ({ queryKey }: any): Promise<Coin[]> => {
  console.log(queryKey);
  const { categoryId, currency } = queryKey[1];
  const query = new URLSearchParams({
    vs_currency: currency.name,
    order: "market_cap_desc",
    per_page: "1000",
    page: "1",
    sparkline: "false",
  });

  if (categoryId) {
    query.append("category", categoryId);
  }
  const response = await api.get("coins/markets?" + query.toString());
  return response.data.map((coin: any) => {
    return {
      ...coin,
      current_price: coin.current_price ?? 0,
      price_change_24h: coin.price_change_24h ?? 0,
      price_change_percentage_24h: coin.price_change_percentage_24h ?? 0,
      market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h ?? 0
    }
  });
};

export const getCategories = async (): Promise<
  { id: string; value: string }[]
> => {
  const response = await api.get("coins/categories/list");
  const categories = response.data;
  return categories.map((category: { category_id: string; name: string }) => {
    return {
      id: category.category_id,
      value: category.name,
    };
  });
};

export const getCurrencies = async (): Promise<
  { id: string; value: string }[]
> => {
  const response = await api.get("simple/supported_vs_currencies");
  const currencies = response.data;
  return currencies.map((value: string) => {
    return {
      id: generateId(value),
      value: value.toUpperCase(),
    };
  });
};
