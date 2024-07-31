import { useAppSelector, useQueryString } from "@libs/hooks";
import { addHoursToLocalTime } from "@libs/utils";
import { ChangeEvent, useCallback, useEffect, useMemo } from "react";

export const useHistoryTableSelector = () => {
	const { searchParams, updateQueryUrl } = useQueryString();
	const histories = useAppSelector((state) => state.historyReducer);

	const type = useMemo(() => searchParams.get("type") || "semua", [searchParams]);

	const modifiedHistories = useMemo(
		() =>
			histories.histories.map((history) => {
				const date = addHoursToLocalTime(history.created_at, 0);

				return {
					"waktu dan tanggal": date.toLocaleTimeString() + " - " + date.toDateString(),
					keterangan: history.text,
					jenis: history.type,
				};
			}),
		[histories]
	);

	const sizePerPage = 20;

	const totalPage = useMemo(
		() =>
			histories.count % sizePerPage === 0
				? Math.floor(histories.count / sizePerPage)
				: Math.floor(histories.count / sizePerPage) + 1,
		[histories.count]
	);

	const showPagination = useMemo(() => totalPage > 1, [totalPage]);

	const typeOnChange = useCallback(
		(e: ChangeEvent<HTMLSelectElement>) =>
			updateQueryUrl("type", e.target.value === "semua" ? "" : e.target.value),
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
		modifiedHistories,
		showPagination,
		totalPage,
		type,
		typeOnChange,
		startDateOnChange,
		endDateOnChange,
	};
};
