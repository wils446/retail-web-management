import React from "react";
import { EditTransactionModal, TransactionTable } from "./components";
import { useTransactionSelector } from "./hooks";

export const TransactionView: React.FC = () => {
	const { editTransactionId, setEditTransactionid } = useTransactionSelector();

	return (
		<>
			<TransactionTable editActionOnClick={(id) => setEditTransactionid(id)} />
			<EditTransactionModal
				isOpen={!!editTransactionId}
				closeModal={() => setEditTransactionid("")}
				transactionId={editTransactionId}
			/>
		</>
	);
};
