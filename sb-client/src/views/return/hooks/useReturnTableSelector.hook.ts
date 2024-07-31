import { RETURN_TYPE_QUERY_MAP } from "@libs/constants";
import { useAppSelector, useQueryString } from "@libs/hooks";
import { addHoursToLocalTime } from "@libs/utils";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useMemo } from "react";

export const useReturnTableSelector = () => {
	const router = useRouter();
	const { searchParams, updateQueryUrl } = useQueryString();
	const returns = useAppSelector((state) => state.returnReducer);

	const search = useMemo(() => searchParams.get("name") || "", [searchParams]);
	const type = useMemo(
		() =>
			searchParams.get("type")
				? searchParams.get("type") === "transaction"
					? "transaksi"
					: "order"
				: "semua",
		[searchParams]
	);

	const modifiedReturns = useMemo(
		() =>
			returns.returns.map((retur) => ({
				id: retur.id,
				name: retur.name,
				type: retur.type === "transaction" ? "transaksi" : "order",
				"created at": addHoursToLocalTime(retur.created_at, 0).toDateString(),
				invoice: retur.invoiceNumber,
				"jumlah barang": retur.returnItem.reduce((prev, curr) => prev + curr.quantity, 0),
			})),
		[returns]
	);

	const sizePerPage = 20;

	const totalPage = useMemo(
		() =>
			returns.count % sizePerPage === 0
				? Math.floor(returns.count / sizePerPage)
				: Math.floor(returns.count / sizePerPage) + 1,
		[returns.count]
	);

	const showPagination = useMemo(() => totalPage > 1, [totalPage]);

	const searchOnChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => updateQueryUrl("name", e.target.value),
		[updateQueryUrl]
	);

	const typeOnChange = useCallback(
		(e: ChangeEvent<HTMLSelectElement>) =>
			updateQueryUrl(
				"type",
				e.target.value === "semua"
					? ""
					: RETURN_TYPE_QUERY_MAP[e.target.value as keyof typeof RETURN_TYPE_QUERY_MAP]
			),
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
		if (!showPagination) updateQueryUrl("page", "");
	}, [showPagination, updateQueryUrl]);

	return {
		modifiedReturns,
		totalPage,
		showPagination,
		router,
		search,
		type,
		searchOnChange,
		typeOnChange,
		startDateOnChange,
		endDateOnChange,
	};
};
