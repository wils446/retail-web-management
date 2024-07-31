import { useItem, useQueryString } from "@libs/hooks";
import { useLazyGetReturnsQuery } from "@libs/redux/api/returnApi";
import { useEffect } from "react";

export const useReturnSelector = () => {
	const [getReturns] = useLazyGetReturnsQuery();
	const { getItem } = useItem();
	const { searchParams } = useQueryString();

	useEffect(() => {
		getReturns({ queryString: searchParams.toString() });
		// getItem();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);
};
