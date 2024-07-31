import { Button, Icon, Input, Modal, Text } from "@components";
import { CartResponse } from "@libs/redux";
import { convertRupiah } from "@libs/utils";
import "twin.macro";
import { QuantityInput } from ".";
import { useAddCartItemSelector } from "../hooks";

type AddCartItemModalProps = {
	isOpen: boolean;
	cart: CartResponse;
	closeModal: () => void;
};

export const AddCartItemModal: React.FC<AddCartItemModalProps> = (props) => {
	const {
		addItemToCart,
		cartItemValue,
		item,
		itemList,
		itemStock,
		updateItemName,
		updatePrice,
		updateQuantity,
		closeModal,
		isAddItemToCartLoading,
		isEditPrice,
		setIsEditPrice,
	} = useAddCartItemSelector(props.cart, props.closeModal);

	return (
		<Modal isOpen={props.isOpen} overlayOnClick={closeModal} title="Tambah Barang">
			<div tw="space-y-2 px-2">
				<div tw="flex items-center space-x-1">
					<Text.H4 tw="w-20 font-light">Nama : </Text.H4>
					<Input
						list="item-list"
						label=""
						value={cartItemValue.itemName}
						onChange={(e) => updateItemName(e.target.value)}
					/>
					<datalist id="item-list">
						{itemList.map((item) => (
							<option key={item.id} value={item.name} />
						))}
					</datalist>
				</div>
				<div tw="flex space-x-1 items-center">
					<Text.H4 tw="font-light w-20">Jumlah : </Text.H4>
					<QuantityInput
						quantity={itemStock ? cartItemValue.quantity : 0}
						setQuantity={updateQuantity}
						min={1}
						max={itemStock}
						disable={!!!itemStock}
					/>
					{!!!itemStock && cartItemValue.itemName !== "" && (
						<Text.H5 tw="text-red-600">stok kosong!!</Text.H5>
					)}
				</div>
				<div tw="flex items-center space-x-1">
					{isEditPrice ? (
						<>
							<Text.H4 tw="font-light w-20">Harga : </Text.H4>
							<Input
								label=""
								value={cartItemValue.price}
								onChange={(e) => updatePrice(+e.target.value)}
							/>
							<button onClick={() => setIsEditPrice(false)}>
								<Icon icon="cross" size="lg" />
							</button>
						</>
					) : (
						<>
							<Text.H4 tw="font-light w-20">Harga : </Text.H4>
							<Text.H4>{convertRupiah(cartItemValue.price)}</Text.H4>
							<button disabled={!!!itemStock} onClick={() => setIsEditPrice(true)}>
								<Icon icon="edit" size="lg" />
							</button>
						</>
					)}
				</div>
				<div tw="flex space-x-5 justify-center py-2">
					<Button buttonColor="blue" disabled={!!!item || !!!itemStock} onClick={addItemToCart}>
						Tambah
					</Button>
					<Button buttonColor="red" onClick={closeModal} disabled={isAddItemToCartLoading}>
						Batal
					</Button>
				</div>
			</div>
		</Modal>
	);
};
