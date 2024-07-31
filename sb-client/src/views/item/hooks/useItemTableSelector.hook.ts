import { useAppSelector, useQueryString } from "@libs/hooks";
import { useLazyGetItemsQuery } from "@libs/redux";
import { convertRupiah } from "@libs/utils";
import { useDebounce } from "@uidotdev/usehooks";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";

export const useItemTableSelector = () => {
	const { searchParams, updateQueryUrl } = useQueryString();
	const items = useAppSelector((state) => state.itemReducer);
	const categories = useAppSelector((state) => state.categoryReducer);

	const [searchValue, setSearchValue] = useState("");
	const debouncedSearchValue = useDebounce(searchValue, 300);

	const categoryOptions = useMemo(() => categories.map((category) => category.name), [categories]);
	const category = useMemo(() => searchParams.get("ctgry") || "Semua", [searchParams]);

	const modifiedItems = useMemo(() => {
		return items.items.map((item) => ({
			id: item.id,
			nama: item.name,
			stok:
				item.stocks && item.stocks.length
					? item.stocks.reduce((prev, curr) => prev + curr.stock, 0)
					: 0,
			harga: convertRupiah(item.price),
			kategori: item.category?.name,
			modal: convertRupiah(item.stocks && item.stocks.length ? item.stocks[0].cost : 0),
		}));
	}, [items]);

	const sizePerPage = 20;

	const totalPage = useMemo(
		() =>
			items.count % sizePerPage === 0
				? Math.floor(items.count / sizePerPage)
				: Math.floor(items.count / sizePerPage) + 1,
		[items.count]
	);

	const showPagination = useMemo(() => totalPage > 1, [totalPage]);

	const searchValueOnChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value),
		[]
	);

	const categoryValueOnChange = useCallback(
		(e: ChangeEvent<HTMLSelectElement>) =>
			updateQueryUrl("category", e.target.value === "Semua" ? "" : e.target.value),
		[updateQueryUrl]
	);

	useEffect(() => {
		updateQueryUrl("name", debouncedSearchValue);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearchValue]);

	useEffect(() => {
		if (!showPagination) updateQueryUrl("page", "");
	}, [showPagination, updateQueryUrl]);

	return {
		categoryOptions,
		showPagination,
		totalPage,
		searchValueOnChange,
		searchParams,
		categoryValueOnChange,
		category,
		modifiedItems,
		searchValue,
	};
};
