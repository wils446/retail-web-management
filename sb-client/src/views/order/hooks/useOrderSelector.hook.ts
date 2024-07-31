import { useItem, useQueryString } from "@libs/hooks";
import { useLazyGetOrdersQuery } from "@libs/redux";
import { useLazyGetReturnsQuery } from "@libs/redux/api/returnApi";
import { useEffect, useState } from "react";

export const useOrderSelector = () => {
	const [getOrders] = useLazyGetOrdersQuery();
	const [getReturns] = useLazyGetReturnsQuery();
	const { getItem } = useItem();
	const { searchParams } = useQueryString();

	const [editOrderId, setEditOrderId] = useState("");

	useEffect(() => {
		getOrders({ queryString: searchParams.toString() });
		// getItem();
		// getReturns();
	}, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

	return {
		editOrderId,
		setEditOrderId,
	};
};
