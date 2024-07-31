import { Modal, Text } from "@components";
import React from "react";
import "twin.macro";
import { useDeleteItemSelector } from "../hooks";

type DeleteItemModalProps = {
	isModalOpen: boolean;
	itemId: string;
	closeModal: () => void;
};

export const DeleteItemModal: React.FC<DeleteItemModalProps> = (props) => {
	const { isLoading, items, onDeleteButtonClick } = useDeleteItemSelector({
		closeModal: props.closeModal,
		itemId: props.itemId,
	});

	return (
		<Modal isOpen={props.isModalOpen} overlayOnClick={props.closeModal}>
			<div tw="p-3 flex flex-col space-y-5">
				<Text.H3 tw="text-center">
					hapus {items.items.find((item) => item.id === props.itemId)?.name}?
				</Text.H3>
				<div tw="flex justify-around space-x-5">
					<button
						tw="px-3 py-1 bg-red-500 text-white hover:bg-red-600 rounded"
						onClick={onDeleteButtonClick}
						disabled={isLoading}
					>
						delete
					</button>
					<button
						tw="px-3 py-1 bg-gray-800 text-white hover:bg-gray-950 rounded"
						onClick={props.closeModal}
						disabled={isLoading}
					>
						cancel
					</button>
				</div>
			</div>
		</Modal>
	);
};
