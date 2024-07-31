import { Button, Input, Modal, Text } from "@components";
import React from "react";
import "twin.macro";
import tw from "twin.macro";
import { useAddOrderItemSelector } from "../hooks";

type OrderItem = {
	id: string;
	name: string;
	quantity: number;
	cost: number;
};

type AddOrderItemModalProps = {
	isOpen: boolean;
	closeModal: () => void;
	onAddButtonClick: (item: OrderItem) => void;
};

export const AddOrderItemModal: React.FC<AddOrderItemModalProps> = (props) => {
	const { addItem, addItemValue, closeModal, isValueValid, itemList, updateItemValue } =
		useAddOrderItemSelector({
			closeModal: props.closeModal,
			onAddButtonClick: props.onAddButtonClick,
		});

	return (
		<Modal isOpen={props.isOpen} overlayOnClick={closeModal} title="Tambah Barang Orderan">
			<div tw="w-96 px-8">
				<div tw="flex flex-col space-y-3">
					<div tw="flex items-center space-x-2">
						<Text.H4>Barang : </Text.H4>
						<div tw="flex-grow">
							<Input
								label=""
								list="add-item-list"
								type="text"
								value={addItemValue.name}
								onChange={(e) => updateItemValue("name", e.target.value)}
								extraInputStyle={tw`w-full`}
							/>
							<datalist id="add-item-list">
								{itemList.map((item) => (
									<option key={item.id} value={item.name} />
								))}
							</datalist>
						</div>
					</div>
					<div tw="flex items-center space-x-2">
						<Text.H4>Jumlah : </Text.H4>
						<div tw="flex-grow">
							<Input
								type="number"
								label=""
								value={addItemValue.quantity.toString()}
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
								value={addItemValue.cost.toString()}
								onChange={(e) => updateItemValue("cost", +e.target.value)}
								extraInputStyle={tw`w-full`}
							/>
						</div>
					</div>
				</div>
				<div tw="py-2 flex justify-center mt-5 space-x-4">
					<Button buttonColor="blue" onClick={addItem} disabled={!isValueValid}>
						Tambah
					</Button>
					<Button buttonColor="red" onClick={() => closeModal()}>
						Batal
					</Button>
				</div>
			</div>
		</Modal>
	);
};
