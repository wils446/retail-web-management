import { Button, Checkbox, Input, Modal, Text } from "@components";
import { QuantityInput } from "@views/cart/components";
import "twin.macro";
import { ItemList, ReturnItemProps, useAddReturnItemSelector } from "../hooks";

type AddReturnItemModalProps = {
	isOpen: boolean;
	closeModal: () => void;
	returableItems: ItemList[];
	returnItems: ReturnItemProps[];
	handleAddButton: (item: ReturnItemProps) => void;
	isTransaction?: boolean;
};

export const AddReturnItemModal: React.FC<AddReturnItemModalProps> = (props) => {
	const {
		itemList,
		returnItemValue,
		updateReturnItem,
		updateQuantity,
		itemQuantity,
		closeModal,
		handleAddButton,
		quantityInputDisable,
		toggleIsSellable,
	} = useAddReturnItemSelector(
		props.returnItems,
		props.handleAddButton,
		props.closeModal,
		props.returableItems
	);

	return (
		<Modal isOpen={props.isOpen} title="Tambah Barang Retur" overlayOnClick={closeModal}>
			<div tw="pb-3 space-y-2 px-2">
				<div tw="flex items-center space-x-1">
					<Text.H4 tw="font-light w-20">Barang : </Text.H4>
					<Input
						list="return-item-list"
						label=""
						value={returnItemValue.name}
						onChange={(e) => updateReturnItem("name", e.target.value)}
					/>
					<datalist id="return-item-list">
						{itemList.map((item, index) => (
							<option key={index} value={item} />
						))}
					</datalist>
				</div>
				<div tw="flex space-x-1 items-center">
					<Text.H4 tw="font-light w-20">Jumlah : </Text.H4>
					<QuantityInput
						quantity={returnItemValue.quantity}
						setQuantity={updateQuantity}
						min={1}
						max={itemQuantity}
						disable={quantityInputDisable}
					/>
				</div>
				<div tw="flex space-x-1 items-center">
					<Text.H4 tw="font-light w-20">Harga : </Text.H4>
					<Input
						label=""
						value={returnItemValue.returnPrice}
						onChange={(e) => updateReturnItem("returnPrice", +e.target.value)}
					/>
				</div>
				{props.isTransaction && (
					<Checkbox
						label="masukkan ke stok"
						isChecked={returnItemValue.isSellable}
						onChangeHandler={toggleIsSellable}
					/>
				)}
				<div tw="flex space-x-5 justify-center pt-4">
					<Button buttonColor="blue" onClick={handleAddButton}>
						Tambah
					</Button>
					<Button buttonColor="neutral" onClick={closeModal}>
						Batal
					</Button>
				</div>
			</div>
		</Modal>
	);
};
