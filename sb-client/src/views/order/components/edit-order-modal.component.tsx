import { Button, Modal, Select, Text } from "@components";
import React from "react";
import "twin.macro";
import { useEditOrderSelector } from "../hooks";
import tw from "twin.macro";

type EditOrderModalProps = {
	isOpen: boolean;
	closeModal: () => void;
	orderId: string;
};

export const EditOrderModal: React.FC<EditOrderModalProps> = (props) => {
	const { closeModal, order, paidStatus, setPaidStatus, updateOrder } = useEditOrderSelector({
		closeModal: props.closeModal,
		orderId: props.orderId,
	});

	return (
		order && (
			<Modal isOpen={props.isOpen} overlayOnClick={closeModal} title={order.name}>
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
						<Button buttonColor="blue" onClick={updateOrder}>
							edit
						</Button>
					</div>
				</div>
			</Modal>
		)
	);
};
