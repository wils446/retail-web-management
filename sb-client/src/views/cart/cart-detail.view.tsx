import { Button, Card, Icon, Input, SkeletonTable, Text } from "@components";
import { convertRupiah } from "@libs/utils";
import "twin.macro";
import { AddCartItemModal, DeleteCartModal, EditCartItemModal } from "./components";
import { useCartDetailSelector } from "./hooks";

export const CartDetailView: React.FC = () => {
	const {
		cart,
		cartItems,
		cartNameValue,
		editCartItemId,
		isAddCartItem,
		isEditCartName,
		router,
		deleteCartId,
		isUpdateCartLoading,
		setDeleteCartId,
		setCartNameValue,
		setEditCartItemId,
		setIsAddCartItem,
		setIsEditCartName,
		updateCartName,
	} = useCartDetailSelector();

	return (
		cart && (
			<>
				<Card>
					<Text.H2 tw="font-semibold text-center py-5">Keranjang</Text.H2>
					<div tw="flex flex-col space-y-2">
						<div tw="flex space-x-2">
							{isEditCartName ? (
								<>
									<Input
										label="Nama : "
										inline
										value={cartNameValue}
										onChange={(e) => setCartNameValue(e.target.value)}
									/>
									<button
										tw="hover:opacity-70 disabled:opacity-70"
										disabled={!!!cartNameValue}
										onClick={updateCartName}
									>
										<Icon icon="check" size="lg" />
									</button>
									<button
										tw="hover:opacity-70 disabled:opacity-70"
										onClick={() => setIsEditCartName(false)}
									>
										<Icon icon="cross" size="lg" />
									</button>
								</>
							) : (
								<div tw="flex space-x-2">
									<Text.H4 tw="text-sm 2xl:text-base">
										Nama : {cart.name ? cart.name : cart.id}
									</Text.H4>
									<button onClick={() => setIsEditCartName(true)}>
										<Icon icon="edit" size="lg" />
									</button>
								</div>
							)}
						</div>
						<div tw="flex flex-col">
							<div tw="flex justify-between pb-2">
								<Text.H4 tw="text-sm 2xl:text-base">Barang : </Text.H4>
								<Button onClick={() => setIsAddCartItem(true)} buttonColor="blue">
									<Icon icon="plus" size="lg" /> Tambah Barang
								</Button>
							</div>
							<SkeletonTable
								data={cartItems!}
								titles={["Nama", "Qty", "Harga"]}
								actions={[{ icon: "edit", onClick: setEditCartItemId }]}
								tableSize={[
									{ key: "Qty", size: "lg" },
									{ key: "Harga", size: "3xl" },
								]}
							/>
							<div tw="h-7 xl:h-9 flex items-center px-10">
								<Text.H5 tw="text-xs 2xl:text-sm">
									Total Harga :{" "}
									{convertRupiah(cart.cartItems.reduce((prev, curr) => prev + curr.price, 0))}
								</Text.H5>
							</div>
						</div>
					</div>
					<div tw="flex justify-center pt-10 space-x-5">
						<Button
							onClick={() => router.push(`/app/cart/${cart.id}/checkout`)}
							buttonColor="blue"
							disabled={!cart.cartItems.length || isUpdateCartLoading}
							tw="text-xs 2xl:text-sm"
						>
							Checkout
						</Button>
						<Button
							onClick={() => setDeleteCartId(cart.id)}
							buttonColor="red"
							disabled={isUpdateCartLoading}
							tw="text-xs 2xl:text-sm"
						>
							Hapus Keranjang
						</Button>
						<Button
							onClick={() => router.back()}
							buttonColor="neutral"
							disabled={isUpdateCartLoading}
							tw="text-xs 2xl:text-sm"
						>
							Kembali
						</Button>
					</div>
				</Card>
				<AddCartItemModal
					isOpen={isAddCartItem}
					closeModal={() => setIsAddCartItem(false)}
					cart={cart}
				/>
				{/* <EditCartItemModal
					isOpen={!!editCartItemId}
					closeModal={() => setEditCartItemId("")}
					cart={cart}
					cartItemId={editCartItemId}
				/> */}
				<DeleteCartModal
					isOpen={!!deleteCartId}
					closeModal={() => setDeleteCartId("")}
					cartId={cart.id}
				/>
			</>
		)
	);
};
