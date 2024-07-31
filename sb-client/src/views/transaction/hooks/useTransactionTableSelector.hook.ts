import { TRANSACTION_QUERY_MAP } from "@libs/constants";
import { useAppSelector, useQueryString } from "@libs/hooks";
import { addHoursToLocalTime, convertRupiah } from "@libs/utils";
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";

export const useTransactionTableSelector = () => {
	const router = useRouter();
	const { searchParams, updateQueryUrl } = useQueryString();
	const transactions = useAppSelector((state) => state.transactionReducer);

	const [searchValue, setSearchValue] = useState("");
	const debouncedSearchValue = useDebounce(searchValue, 300);

	const status = useMemo(
		() =>
			TRANSACTION_QUERY_MAP[
				(searchParams.get("paid") as keyof typeof TRANSACTION_QUERY_MAP) || "semua"
			],
		[searchParams]
	);

	const modifiedTransaction = useMemo(() => {
		return transactions.transactions.map((transaction) => ({
			id: transaction.id,
			nama: transaction.name,
			invoice: transaction.invoiceNumber,
			"created at": addHoursToLocalTime(transaction.created_at, 0).toDateString(),
			"updated at": new Date(transaction.updated_at).toDateString(),
			pembayaran: transaction.paid ? "lunas" : "belum lunas",
			status: transaction.status,
			"total harga": convertRupiah(transaction.totalPrice),
			"total barang": transaction.items.reduce((prev, current) => prev + current.quantity, 0),
		}));
	}, [transactions, searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

	const sizePerPage = 20;

	const totalPage = useMemo(
		() =>
			transactions.count % sizePerPage === 0
				? Math.floor(transactions.count / sizePerPage)
				: Math.floor(transactions.count / sizePerPage) + 1,
		[transactions.count]
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
		updateQueryUrl("name", debouncedSearchValue);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearchValue]);

	useEffect(() => {
		if (!showPagination) updateQueryUrl("page", "");
	}, [showPagination, updateQueryUrl]);

	return {
		showPagination,
		totalPage,
		router,
		searchOnChange,
		searchParams,
		statusOnChange,
		searchValue,
		status,
		modifiedTransaction,
		startDateOnChange,
		endDateOnChange,
	};
};
