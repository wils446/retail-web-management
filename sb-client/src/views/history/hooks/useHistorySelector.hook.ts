import { useQueryString } from "@libs/hooks";
import { useLazyGetHistoryQuery } from "@libs/redux";
import { useEffect } from "react";

export const useHistorySelector = () => {
	const [getHistory] = useLazyGetHistoryQuery();
	const { searchParams } = useQueryString();

	useEffect(() => {
		getHistory({ queryString: searchParams.toString() });
	}, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps
};
