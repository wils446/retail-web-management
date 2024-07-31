import { useAppSelector, usePromiseToast } from "@libs/hooks";
import { useUpdateTransactionMutation } from "@libs/redux";
import { useEffect, useState } from "react";

export const useEditTransactionSelector = (transactionId: string, closeModalFn: () => void) => {
	const { endLoading, startLoading } = usePromiseToast();
	const [updateTransactionFn, { isLoading: isUpdateTransactionLoading }] =
		useUpdateTransactionMutation();
	const transactions = useAppSelector((state) => state.transactionReducer);
	const transaction = transactions.transactions.find(
		(transaction) => transaction.id === transactionId
	);

	const [paidStatus, setPaidStatus] = useState("");

	const initiateValue = () => {
		const transaction = transactions.transactions.find(
			(transaction) => transaction.id === transactionId
		);
		setPaidStatus(transaction?.paid ? "lunas" : "belum lunas");
	};

	const closeModal = () => {
		if (isUpdateTransactionLoading) return;
		closeModalFn();
	};

	const updateTransaction = async () => {
		startLoading();
		const response = await updateTransactionFn({
			id: transactionId,
			paid: paidStatus === "lunas",
		});
		endLoading(response, "Transaksi berhasil di edit");
		closeModal();
	};

	useEffect(initiateValue, [transactionId, transactions]);

	return {
		transaction,
		closeModal,
		paidStatus,
		setPaidStatus,
		updateTransaction,
	};
};
