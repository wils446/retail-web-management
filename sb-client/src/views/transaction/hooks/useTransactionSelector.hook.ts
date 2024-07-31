import { useQueryString } from "@libs/hooks";
import { useLazyGetTransactionsQuery } from "@libs/redux/api";
import { useLazyGetReturnsQuery } from "@libs/redux/api/returnApi";
import { useEffect, useState } from "react";

export const useTransactionSelector = () => {
	const [getTransactions] = useLazyGetTransactionsQuery();
	const [editTransactionId, setEditTransactionid] = useState("");
	const [getReturns] = useLazyGetReturnsQuery();
	const { searchParams } = useQueryString();

	useEffect(() => {
		getTransactions({ queryString: searchParams.toString() });
		getReturns();
	}, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

	return { editTransactionId, setEditTransactionid };
};
