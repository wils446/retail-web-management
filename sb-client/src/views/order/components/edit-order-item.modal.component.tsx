import { Button, Input, Modal, Text } from "@components";
import { Dispatch, SetStateAction } from "react";
import "twin.macro";
import tw from "twin.macro";
import { useEditOrderItemSelector } from "../hooks";

type OrderItem = {
	id: string;
	name: string;
	quantity: number;
	cost: number;
};

type EditOrderItemModalProps = {
	isOpen: boolean;
	closeModal: () => void;
	itemId: string;
	orderItems: OrderItem[];
	setOrderItem: Dispatch<SetStateAction<OrderItem[]>>;
};

export const EditOrderItemModal: React.FC<EditOrderItemModalProps> = (
	props
) => {
	const { itemValue, updateItemValue, updateOrderItem } =
		useEditOrderItemSelector({
			closeModal: props.closeModal,
			itemId: props.itemId,
			orderItems: props.orderItems,
			setOrderItem: props.setOrderItem,
		});

	return (
		<Modal
			isOpen={props.isOpen}
			overlayOnClick={props.closeModal}
			title="Edit Barang Orderan"
		>
			<div tw="w-96 px-8">
				<div tw="flex flex-col space-y-3">
					<Text.H4>Nama : {itemValue.name}</Text.H4>
					<div tw="flex items-center space-x-2">
						<Text.H4>Jumlah : </Text.H4>
						<div tw="flex-grow">
							<Input
								type="number"
								label=""
								value={itemValue.quantity.toString()}
								onChange={(e) => updateItemValue("quantity", +e.target.value)}
								extraInputStyle={tw`w-full`}
							/>
						</div>
					</div>
					<div tw="flex items-center space-x-2">
						<Text.H4>Harga : </Text.H4>
						<div tw="flex-grow">
							<Input
								type="number"
								label=""
								value={itemValue.cost.toString()}
								onChange={(e) => updateItemValue("cost", +e.target.value)}
								extraInputStyle={tw`w-full`}
							/>
						</div>
					</div>
					<div tw="py-2 flex justify-center mt-5 space-x-4">
						<Button buttonColor="blue" onClick={updateOrderItem}>
							Edit
						</Button>
						<Button buttonColor="red" onClick={() => props.closeModal()}>
							Batal
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
};
