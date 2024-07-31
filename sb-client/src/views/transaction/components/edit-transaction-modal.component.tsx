import { Button, Modal, Select, Text } from "@components";
import React from "react";
import "twin.macro";
import { useEditTransactionSelector } from "../hooks";
import tw from "twin.macro";

type EditTransactionModalProps = {
	isOpen: boolean;
	transactionId: string;
	closeModal: () => void;
};

export const EditTransactionModal: React.FC<EditTransactionModalProps> = (props) => {
	const { closeModal, paidStatus, setPaidStatus, transaction, updateTransaction } =
		useEditTransactionSelector(props.transactionId, props.closeModal);

	return (
		transaction && (
			<Modal isOpen={props.isOpen} overlayOnClick={closeModal} title={transaction.name}>
				<div tw="max-w-lg w-56 flex flex-col items-center">
					<div tw="flex space-x-2 items-center justify-center mb-3">
						<Select
							label="Status :"
							showLabel
							value={paidStatus}
							options={["lunas", "belum lunas"]}
							onChange={(e) => setPaidStatus(e.target.value)}
							extraSelectStyle={tw`w-[10rem]`}
						/>
					</div>
					<div tw="py-2">
						<Button buttonColor="blue" onClick={updateTransaction}>
							edit
						</Button>
					</div>
				</div>
			</Modal>
		)
	);
};
