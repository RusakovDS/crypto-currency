import React from "react";
import { ChangeEvent, useEffect, useState } from "react";
import { BiChevronDown, BiSearch, BiX } from "react-icons/bi";

interface DropdownItem {
  id: string;
  value: string;
}

interface Props {
  placeholder?: string;
  items: DropdownItem[] | undefined;
  onSelect: (item: DropdownItem | null) => void;
  needToClear?: boolean;
  defaultValue?: string | null;
}

const CustomDropdownWithSearch = React.memo(
  ({
    placeholder = "Select",
    items = [],
    onSelect,
    defaultValue,
    needToClear = false,
  }: Props) => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [filteredItems, setFilteredItems] = useState(items);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);

    function handleOnClickItem(item: DropdownItem) {
      setSelectedValue(item.value);
      setIsOpen((prev) => !prev);
      setSearchValue("");
      onSelect(item);
    }

    useEffect(() => {
      setFilteredItems(() =>
        items.filter((item) =>
          item.value.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }, [items, searchValue]);

    function handleSearchValue(e: ChangeEvent<HTMLInputElement>) {
      setSearchValue(e.target.value);
    }

    function handleClear(e: any) {
      e.stopPropagation();
      setSelectedValue(null);
      if (isOpen) {
        setIsOpen(false);
      }
      onSelect(null);
    }

    return (
      <fieldset className="relative">
        <button
          className={`flex w-full items-center justify-between rounded-md bg-white px-4 py-2 shadow-md`}
          onClick={() => setIsOpen((prev) => !prev)}
          onBlur={() => setIsOpen(false)}
        >
          <div className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
            {selectedValue || defaultValue || (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          <div className="flex items-center justify-end">
            {selectedValue && needToClear && (
              <BiX
                size="1.5em"
                onClick={(e) => handleClear(e)}
                className="text-gray-500"
              />
            )}
            <BiChevronDown size="1.5em" />
          </div>
        </button>
        {isOpen && (
          <div className="absolute z-10 mt-1 h-fit max-h-52 w-full overflow-auto rounded-md bg-white py-2 shadow-md">
            <div className="flex w-full items-center border-t border-b focus-within:border-blue-500 hover:border-blue-500">
              <BiSearch size="1.3em" className="w-10 text-gray-500" />
              <label htmlFor="item-search" className="sr-only"></label>
              <input
                onChange={handleSearchValue}
                value={searchValue}
                id="item-search"
                type="text"
                placeholder="Search..."
                className="w-full py-2 focus:outline-none"
              />
            </div>
            {filteredItems.map((item) => {
              return (
                <button
                  key={item.id}
                  className="flex w-full px-4 py-2 text-left hover:bg-blue-400 hover:text-white focus:bg-blue-400 focus:text-white"
                  onClick={() => handleOnClickItem(item)}
                >
                  {item.value}
                </button>
              );
            })}
          </div>
        )}
      </fieldset>
    );
  }
);

export default CustomDropdownWithSearch;
