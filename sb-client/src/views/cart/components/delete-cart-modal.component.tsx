import { Button, Modal, Text } from "@components";
import React from "react";
import "twin.macro";
import { useDeleteCartSelector } from "../hooks";

type DeleteCartModalProps = {
	isOpen: boolean;
	closeModal: () => void;
	cartId: string;
};

export const DeleteCartModal: React.FC<DeleteCartModalProps> = (props) => {
	const { closeModal, deleteCart } = useDeleteCartSelector(props.cartId, props.closeModal);

	return (
		<Modal isOpen={props.isOpen} overlayOnClick={closeModal}>
			<div tw="w-72 flex flex-col items-center py-2 space-y-4">
				<Text.H2 tw="font-semibold text-lg 2xl:text-xl">hapus keranjang ini?</Text.H2>
				<div tw="flex space-x-5">
					<Button buttonColor="blue" onClick={deleteCart}>
						hapus
					</Button>
					<Button buttonColor="red" onClick={closeModal}>
						batal
					</Button>
				</div>
			</div>
		</Modal>
	);
};
