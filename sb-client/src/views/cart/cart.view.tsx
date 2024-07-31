import { Button, Icon, Input, Text } from "@components";
import { addHoursToLocalTime, convertRupiah } from "@libs/utils";
import React from "react";
import tw from "twin.macro";
import { useCartSelector } from "./hooks";

export const CartView: React.FC = () => {
	const { createCart, modifiedCarts, router, searchValue, setSearchValue } = useCartSelector();

	return (
		<>
			<div tw="h-full w-full p-2">
				<div tw="flex space-x-2">
					<Input
						label=""
						placeholder="search..."
						extraInputStyle={tw`w-56`}
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
					/>
					<Button buttonColor="blue" onClick={createCart}>
						<Icon icon="plus" size="lg" />
						Tambah Keranjang
					</Button>
				</div>
				{/* rowl space-y-2 -> 4 */}
				<div tw="flex flex-col my-4 space-y-4">
					{modifiedCarts.map((cart) => {
						const totalItems = cart.cartItems
							? cart.cartItems.reduce((prev, curr) => prev + curr.quantity, 0)
							: 0;
						const totalPrice = cart.cartItems
							? cart.cartItems.reduce((prev, curr) => prev + curr.price, 0)
							: 0;

						return (
							// rowl border-neutral-500 -> 400, py-2 -> 3
							<div key={cart.id} tw="w-full max-w-xl border p-3 rounded border-neutral-400">
								<div tw="flex justify-between items-center">
									<Text.H3 tw="text-base 2xl:text-lg font-semibold">
										{!!cart.name ? cart.name : cart.id}
									</Text.H3>
									<Text.H6 tw="font-light text-neutral-600">
										{addHoursToLocalTime(cart.updated_at, 0).toDateString()}
									</Text.H6>
								</div>
								<div tw="w-full border-b border-neutral-300 my-2" />
								<div tw="flex flex-col space-y-1">
									<div>
										<Text.H5 tw="text-xs 2xl:text-sm">Jumlah Barang : {totalItems}</Text.H5>
									</div>
									<div>
										<Text.H5 tw="text-xs 2xl:text-sm">
											Total Harga : {convertRupiah(totalPrice)}
										</Text.H5>
									</div>
								</div>

								<div tw="w-full border-b border-neutral-300 my-2" />

								<div tw="flex justify-between space-x-2">
									<button
										tw="bg-blue-600 hover:bg-blue-700 text-xs 2xl:text-sm px-4 py-1.5 rounded text-white"
										onClick={() => router.push(`/app/cart/${cart.id}`)}
									>
										lihat detail
									</button>
									<button
										tw="bg-red-600 hover:bg-red-700 text-xs 2xl:text-sm px-4 py-1.5 rounded text-white"
										onClick={() => router.push(`/app/cart/${cart.id}`)}
									>
										Hapus
									</button>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
};
