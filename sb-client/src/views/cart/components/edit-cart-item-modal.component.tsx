import { Button, Icon, Input, Modal, Text } from "@components";
import { CartResponse } from "@libs/redux";
import { convertRupiah } from "@libs/utils";
import "twin.macro";
import { QuantityInput } from ".";
import { useEditCartItemSelector } from "../hooks";

type EditCartItemModalProps = {
	isOpen: boolean;
	cart: CartResponse;
	cartItemId: string;
	closeModal: () => void;
};

export const EditCartItemModal: React.FC<EditCartItemModalProps> = (props) => {
	const {
		cartItem,
		cartItemValue,
		closeModal,
		deleteItemFromCart,
		isDeleteItemFromCartLoading,
		isEditPrice,
		isUpdateCartItemLoading,
		item,
		itemStock,
		updateCartItem,
		updatePrice,
		updateQuantity,
		setIsEditPrice,
	} = useEditCartItemSelector(props.cart, props.cartItemId, props.closeModal);

	return (
		cartItem && (
			<Modal isOpen={props.isOpen} overlayOnClick={closeModal} title={"Barang Keranjang"}>
				<div tw="pb-1 px-3 flex-col space-y-2 w-[512px] ">
					<div tw="flex space-x-2 items-center">
						<Text.H4 tw="font-light text-sm 2xl:text-base">Nama : {cartItem.name}</Text.H4>
					</div>
					<div tw="flex space-x-2 items-center">
						<Text.H4 tw="font-light text-sm 2xl:text-base">Jumlah : </Text.H4>
						<QuantityInput
							quantity={cartItemValue.quantity}
							setQuantity={updateQuantity}
							min={1}
							max={itemStock}
							disable={!!!itemStock}
						/>
					</div>
					<div tw="flex space-x-2">
						{isEditPrice ? (
							<>
								<Input
									label="Harga : "
									type="number"
									inline
									value={cartItemValue.price.toString()}
									onChange={(e) => updatePrice(+e.target.value)}
								/>
								<button onClick={() => setIsEditPrice(false)}>
									<Icon icon="cross" size="lg" />
								</button>
							</>
						) : (
							<>
								<Text.H4 tw="font-light text-sm 2xl:text-base">
									Harga : {convertRupiah(cartItemValue.price)}
								</Text.H4>
								<button onClick={() => setIsEditPrice(true)}>
									<Icon icon="edit" size="lg" />
								</button>
							</>
						)}
					</div>
					<div tw="flex space-x-5 justify-center py-2 pt-5">
						<Button buttonColor="blue" disabled={!!!item || !!!itemStock} onClick={updateCartItem}>
							Ubah
						</Button>
						<Button
							buttonColor="red"
							onClick={deleteItemFromCart}
							disabled={isDeleteItemFromCartLoading || isUpdateCartItemLoading}
						>
							Hapus
						</Button>
						<Button
							buttonColor="neutral"
							onClick={closeModal}
							disabled={isDeleteItemFromCartLoading || isUpdateCartItemLoading}
						>
							Kembali
						</Button>
					</div>
				</div>
			</Modal>
		)
	);
};
