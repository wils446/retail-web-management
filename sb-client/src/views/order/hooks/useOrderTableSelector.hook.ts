import { ORDER_QUERY_MAP } from "@libs/constants";
import { useAppSelector, useQueryString } from "@libs/hooks";
import { addHoursToLocalTime, convertRupiah } from "@libs/utils";
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";

export const useOrderTableSelector = () => {
	const router = useRouter();
	const { updateQueryUrl, searchParams } = useQueryString();
	const orders = useAppSelector((state) => state.orderReducer);

	const [searchValue, setSearchValue] = useState("");
	const deboucedSearchValue = useDebounce(searchValue, 300);

	const status = useMemo(
		() => ORDER_QUERY_MAP[(searchParams.get("paid") as keyof typeof ORDER_QUERY_MAP) || "semua"],
		[searchParams]
	);

	const modifiedOrders = useMemo(
		() =>
			orders.orders.map((order) => ({
				id: order.id,
				name: order.name,
				pembayaran: order.paid ? "lunas" : "belum lunas",
				status: order.status,
				invoice: order.invoiceNumber,
				"total barang": order.items.reduce((prev, curr) => prev + curr.quantity, 0),
				"total harga": convertRupiah(order.items.reduce((prev, curr) => prev + curr.cost, 0)),
				"created at": addHoursToLocalTime(order.created_at, 0).toDateString(),
			})),
		[orders, searchParams] //eslint-disable-line react-hooks/exhaustive-deps
	);

	const sizePerPage = 20;

	const totalPage = useMemo(
		() =>
			orders.count % sizePerPage === 0
				? Math.floor(orders.count / sizePerPage)
				: Math.floor(orders.count / sizePerPage) + 1,
		[orders.count]
	);

	const showPagination = useMemo(() => totalPage > 1, [totalPage]);

	const searchOnChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value),
		[]
	);

	const statusOnChange = useCallback(
		(e: ChangeEvent<HTMLSelectElement>) =>
			updateQueryUrl("paid", e.target.value === "semua" ? "" : "" + (e.target.value === "lunas")),
		[updateQueryUrl]
	);

	const startDateOnChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => updateQueryUrl("startDate", e.target.value),
		[updateQueryUrl]
	);

	const endDateOnChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => updateQueryUrl("endDate", e.target.value),
		[updateQueryUrl]
	);

	useEffect(() => {
		updateQueryUrl("name", deboucedSearchValue);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deboucedSearchValue]);

	useEffect(() => {
		if (!showPagination) updateQueryUrl("page", "");
	}, [showPagination, updateQueryUrl]);

	return {
		modifiedOrders,
		showPagination,
		totalPage,
		router,
		status,
		searchOnChange,
		statusOnChange,
		startDateOnChange,
		endDateOnChange,
		searchValue,
	};
};
