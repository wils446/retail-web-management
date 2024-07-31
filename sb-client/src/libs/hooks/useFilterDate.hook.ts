import { ChangeEvent, useCallback } from "react";
import { useQueryString } from "./useQueryString.hook";

export const useFilterDate = () => {
	const { searchParams, updateQueryUrl } = useQueryString();

	const minDateOnChange = (e: ChangeEvent<HTMLInputElement>) =>
		updateQueryUrl("minDate", e.target.value);
	const maxDateOnChange = (e: ChangeEvent<HTMLInputElement>) =>
		updateQueryUrl("maxDate", e.target.value);
	const filterDate = useCallback(
		(date: string): boolean => {
			const rawMinDate = searchParams.get("minDate") || "";
			const rawMaxDate = searchParams.get("maxDate") || "";

			if (!rawMinDate) return true;

			const targetDate = new Date(date);
			const min = new Date(rawMinDate);
			const max = new Date(rawMaxDate);

			min.setHours(0);
			max.setHours(24);

			return rawMaxDate ? targetDate <= max && targetDate >= min : targetDate >= min;
		},
		[searchParams]
	);

	return { filterDate, minDateOnChange, maxDateOnChange };
};
