import { Button, Checkbox, Icon, Input, Modal, Text } from "@components";
import { convertRupiah } from "@libs/utils";
import { QuantityInput } from "@views/cart/components";
import "twin.macro";
import { ReturnItemProps, useEditReturnItemSelector } from "../hooks";

type EditReturnItemModalProps = {
	isOpen: boolean;
	closeModal: () => void;
	editItemId: string;
	returnItems: ReturnItemProps[];
	onEditButtonClick: (item: ReturnItemProps) => void;
	onDeleteButtonClick: (id: string) => void;
	isTransaction?: boolean;
};

export const EditReturnItemModal: React.FC<EditReturnItemModalProps> = (props) => {
	const {
		editItemValue,
		updateEditItemValue,
		updateQuantity,
		isEditPrice,
		toggleEditPrice,
		closeModal,
		onDeleteButtonClick,
		onEditButtonClick,
		toggleIsSellable,
	} = useEditReturnItemSelector(
		props.editItemId,
		props.returnItems,
		props.onEditButtonClick,
		props.onDeleteButtonClick,
		props.closeModal
	);

	return (
		<Modal isOpen={props.isOpen} title="Edit Barang Retur">
			<div tw="pb-1 px-3 flex-col space-y-2 w-[512px] ">
				<div tw="flex space-x-2 items-center">
					<Text.H4 tw="font-light">Nama : {editItemValue.name}</Text.H4>
				</div>
				<div tw="flex space-x-2 items-center">
					<Text.H4 tw="font-light">Jumlah : </Text.H4>
					<QuantityInput quantity={editItemValue.quantity} setQuantity={updateQuantity} min={1} />
				</div>
				<div tw="flex space-x-2 items-center">
					{isEditPrice ? (
						<>
							<Input
								type="number"
								label="Harga : "
								inline
								value={editItemValue.returnPrice.toString()}
								onChange={(e) => updateEditItemValue("returnPrice", +e.target.value)}
							/>
							<button onClick={toggleEditPrice}>
								<Icon icon="cross" size="lg" />
							</button>
						</>
					) : (
						<>
							<Text.H4 tw="font-light">Harga : {convertRupiah(editItemValue.returnPrice)}</Text.H4>
							<button onClick={toggleEditPrice}>
								<Icon icon="edit" size="lg" />
							</button>
						</>
					)}
				</div>
				{props.isTransaction && (
					<Checkbox
						isChecked={editItemValue.isSellable}
						label="masuk ke stok"
						onChangeHandler={toggleIsSellable}
					/>
				)}
				<div tw="flex space-x-5 justify-center py-2 pt-5">
					<Button
						buttonColor="blue"
						disabled={!!!editItemValue.quantity}
						onClick={onEditButtonClick}
					>
						Ubah
					</Button>
					<Button buttonColor="red" onClick={onDeleteButtonClick}>
						Hapus
					</Button>
					<Button buttonColor="neutral" onClick={closeModal}>
						Kembali
					</Button>
				</div>
			</div>
		</Modal>
	);
};
