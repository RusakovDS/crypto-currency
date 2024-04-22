import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { useCallback, useState } from "react";
import { BiCaretDown, BiCaretUp } from "react-icons/bi";
import { Link } from "react-router-dom";
import CustomDropdownWithSearch from "../components/CustomDropdownWithSearch";
import { Coin, getCategories, getCoins, getCurrencies } from "../services/api";
import { getCurrencySymbol } from "../utils/currencies";

interface Currency {
  name: string;
  symbol: string | null;
}

const init_currency: Currency = {
  name: "USD",
  symbol: getCurrencySymbol("USD"),
};

const CoinsPage = () => {
  const [currency, setCurrency] = useState<Currency>(init_currency);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const { data: currencies, isLoading: isCurrenciesLoading } = useQuery({
    queryKey: ["currencies"],
    queryFn: getCurrencies,
  });
  const {
    data: coins,
    isLoading,
    isError,
  } = useQuery<Coin[]>({
    queryKey: ["coins", { currency, categoryId }],
    queryFn: getCoins,
  });

  const onSelectCategory = useCallback(
    (selectedCategory: { id: string; value: string } | null) => {
      if (!selectedCategory) {
        setCategoryId(null);
        return;
      }

      const id =
        categories?.find(
          (category) => category.value === selectedCategory.value
        )?.id || null;
      setCategoryId(id);
    },
    [categoryId, categories]
  );

  const onSelectCurrency = useCallback(
    (selectedCurrency: { id: string; value: string } | null) => {
      setCurrency(
        selectedCurrency
          ? {
              name: selectedCurrency.value,
              symbol: getCurrencySymbol(selectedCurrency.value),
            }
          : init_currency
      );
    },
    [currency]
  );

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex h-48 w-96 flex-col items-center justify-center space-y-6 rounded-md bg-gray-100 text-center">
          <h1 className="text-5xl">Request limit!</h1>
          <p>Wait for 5-10 minutes and reload page.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="flex h-full items-center justify-center">
      <div className="flex h-full w-full flex-col bg-gray-100 bg-opacity-80 shadow-md sm:h-5/6 sm:w-5/6 sm:rounded-md">
        <div className="flex items-center gap-2 px-6 py-3">
          {isCategoriesLoading || isCurrenciesLoading ? (
            <div className="flex h-full w-full items-center justify-center text-2xl">
              Loading...
            </div>
          ) : (
            <div className="w-full sm:flex sm:gap-2">
              <div className="sm:w-52">
                <div>Category</div>
                <CustomDropdownWithSearch
                  placeholder="Category"
                  items={categories}
                  onSelect={onSelectCategory}
                  needToClear
                />
              </div>
              <div>
                <div className="w-28">
                  <div>Currency</div>
                  <CustomDropdownWithSearch
                    placeholder="Currency"
                    items={currencies}
                    onSelect={onSelectCurrency}
                    defaultValue={currency.name}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center text-2xl">
            Loading...
          </div>
        ) : (
          <div className="h-full overflow-auto">
            <table className="w-full p-2 text-left text-sm text-gray-700 dark:text-gray-400 sm:table-auto">
              <thead className="sticky top-0 bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-3">
                    Rank
                  </th>
                  <th scope="col" className="p-3">
                    Logo
                  </th>
                  <th scope="col" className="max-w-[96px] p-3">
                    Symbol
                  </th>
                  <th scope="col" className="p-3">
                    Name
                  </th>
                  <th scope="col" className="p-3">
                    Price, {currency.name}
                  </th>
                  <th scope="col" className="p-3">
                    Exchange 24h, %
                  </th>
                  <th scope="col" className="p-3">
                    Market Cap, {currency.name}
                  </th>
                  <th scope="col" className="p-3">
                    Exchange 24h, %
                  </th>
                  <th scope="col" className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {coins.map((item) => {
                  return (
                    <tr
                      key={item.id}
                      className="border-b bg-opacity-90 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                    >
                      <td className="px-2 py-4 text-center">
                        {item.market_cap_rank}
                      </td>
                      <td className="h-10 w-10 px-2 py-4">
                        <img src={item.image} alt="Coin Image" />
                      </td>
                      <td className="max-w-[96px] px-2">
                        <div className=" w-full overflow-auto py-4">
                          {item.symbol.toUpperCase()}
                        </div>
                      </td>
                      <td className="px-2 py-4">{item.name}</td>
                      <td className="px-2 py-4">
                        {currency.symbol}
                        {item.current_price.toLocaleString()}
                      </td>
                      <td
                        className={classNames(
                          "px-2 py-4",

                          item.price_change_percentage_24h >= 0
                            ? "text-green-700"
                            : "text-red-700"
                        )}
                      >
                        {item.price_change_percentage_24h >= 0 ? (
                          <BiCaretUp className="inline" />
                        ) : (
                          <BiCaretDown className="inline" />
                        )}
                        {item.price_change_percentage_24h.toFixed(2)}%
                      </td>
                      <td className="px-2 py-4">
                        {currency.symbol}
                        {item.market_cap ? item.market_cap.toLocaleString() : 0}
                      </td>
                      <td
                        className={classNames(
                          "px-2 py-4",

                          item.market_cap_change_percentage_24h >= 0
                            ? "text-green-700"
                            : "text-red-700"
                        )}
                      >
                        {item.market_cap_change_percentage_24h >= 0 ? (
                          <BiCaretUp className="inline" />
                        ) : (
                          <BiCaretDown className="inline" />
                        )}
                        {item.market_cap_change_percentage_24h.toFixed(2)}%
                      </td>
                      <td className="px-2 py-4">
                        <Link
                          to={item.symbol}
                          className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoinsPage;
