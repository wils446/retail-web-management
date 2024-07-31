import { Button, Card, SkeletonTable, Text } from "@components";
import { addHoursToLocalTime } from "@libs/utils";
import "twin.macro";
import { ReturnInvoice } from "./components";
import { useReturnDetailSelector } from "./hooks";

export const ReturnDetailView: React.FC = () => {
	const { retur, router, returItems, totalReturnPrice, generateAndOpenPdfTab, invoiceRef } =
		useReturnDetailSelector();

	return (
		retur && (
			<>
				<Card>
					<Text.H2 tw="font-semibold text-center py-5">Retur</Text.H2>
					<div tw="flex flex-col space-y-2">
						<Text.H4>Nama : {retur.name}</Text.H4>
						<Text.H4>Tipe Retur : {retur.type === "transaction" ? "transaksi" : "order"}</Text.H4>
						<Text.H4>No Invoice : {retur.invoiceNumber}</Text.H4>
						<Text.H4>
							Tanggal : {addHoursToLocalTime(retur.created_at, 0).toLocaleDateString()}
						</Text.H4>
						<Text.H4> Barang : </Text.H4>
						<SkeletonTable
							data={returItems}
							titles={["Nama", "Qty", "Harga"]}
							tableSize={[
								{
									key: "Qty",
									size: "xl",
								},
								{
									key: "Harga",
									size: "3xl",
								},
							]}
						/>
						<div tw="h-7 xl:h-9 flex items-center px-10">
							<Text.H5>Total Harga : {totalReturnPrice}</Text.H5>
						</div>
					</div>
					<div tw="flex justify-center pt-5 space-x-5">
						<Button buttonColor="blue" onClick={generateAndOpenPdfTab}>
							Invoice
						</Button>
						<Button buttonColor="neutral" onClick={() => router.back()}>
							Kembali
						</Button>
					</div>
				</Card>
				<div
					style={{
						position: "absolute",
						left: "-99999px",
						top: "-99999px",
					}}
				>
					<ReturnInvoice
						componentRef={invoiceRef}
						data={returItems}
						date={retur.created_at}
						sellerName={retur.name}
						totalPrice={retur.returnItem.reduce((prev, curr) => prev + curr.returnPrice, 0)}
						invoiceNumber={retur.invoiceNumber}
						type={retur.type}
					/>
				</div>
			</>
		)
	);
};
