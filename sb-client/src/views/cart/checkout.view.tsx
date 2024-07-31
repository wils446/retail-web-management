import { Button, Card, Input, Select, SkeletonTable, Text } from "@components";
import { convertRupiah } from "@libs/utils";
import "twin.macro";
import { useCheckoutSelector } from "./hooks";

type PaidStatus = "Belum Lunas" | "Lunas";

export const CheckoutView: React.FC = () => {
	const {
		cartItems,
		discountPrice,
		formValue,
		isCreateTransactionLoading,
		router,
		price,
		totalPrice,
		updateForm,
		submitTransaction,
	} = useCheckoutSelector();

	return (
		<Card>
			<Text.H2 tw="font-semibold text-center py-5">Checkout</Text.H2>
			<div tw="flex flex-col space-y-5">
				<Input
					label="Nama*"
					type="text"
					value={formValue.name}
					onChange={(e) => updateForm("name", e.target.value)}
				/>
				<div tw="flex flex-col space-y-1">
					<Input
						label="Alamat"
						type="text"
						value={formValue.address}
						onChange={(e) => updateForm("address", e.target.value)}
					/>
					<div tw="flex space-x-10">
						<Input
							label="Kota"
							type="text"
							value={formValue.city}
							onChange={(e) => updateForm("city", e.target.value)}
						/>
						<Input
							label="Provinsi"
							type="text"
							value={formValue.province}
							onChange={(e) => updateForm("province", e.target.value)}
						/>
					</div>
					<div tw="flex space-x-10">
						<Input
							label="Kode Pos"
							type="text"
							value={formValue.postalCode}
							onChange={(e) => updateForm("postalCode", e.target.value)}
						/>
						<Input
							label="Negara"
							type="text"
							value={formValue.country}
							onChange={(e) => updateForm("country", e.target.value)}
						/>
					</div>
				</div>
				<div tw="flex space-x-10">
					<Input
						label="Discount (%)"
						type="number"
						value={formValue.discount.toString()}
						max={100}
						onChange={(e) => updateForm("discount", +e.target.value)}
					/>
					<div>
						<Text.H4 tw="font-light">Status</Text.H4>
						<Select
							label="Status"
							options={["Lunas", "Belum Lunas"]}
							defaultValue={formValue.paidStatus}
							onChange={(e) => updateForm("paidStatus", e.target.value as PaidStatus)}
						/>
					</div>
				</div>
				<div tw="flex flex-col">
					<SkeletonTable data={cartItems} titles={["Nama", "Qty", "Harga"]} />
					<div tw="flex flex-col px-10 py-2">
						<Text.H5>Total Harga : {convertRupiah(price)}</Text.H5>
						{formValue.discount > 0 && (
							<>
								<Text.H5>
									Discount ({formValue.discount}%) : {convertRupiah(discountPrice)}
								</Text.H5>
								<Text.H5>Total Akhir : {convertRupiah(totalPrice)}</Text.H5>
							</>
						)}
					</div>
				</div>
				<div tw="flex py-2  2xl:py-4 space-x-5 justify-center">
					<Button
						onClick={submitTransaction}
						disabled={isCreateTransactionLoading || !!!formValue.name}
						buttonColor="blue"
					>
						Submit
					</Button>
					<Button
						onClick={() => router.back()}
						disabled={isCreateTransactionLoading}
						buttonColor="neutral"
					>
						Kembali
					</Button>
				</div>
			</div>
		</Card>
	);
};
