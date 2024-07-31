import { Button, Card, Icon, SkeletonTable, Text } from "@components";
import { convertRupiah } from "@libs/utils";
import "twin.macro";
import { TransactionInvoice } from "./components";
import { useTransactionDetailSelector } from "./hooks";

const ReturCard = (props: { children: React.ReactNode; onClick?: () => void }) => (
	<div tw="flex justify-center">
		<div
			tw="bg-white w-[660px]  2xl:w-[768px] border px-3 py-2 rounded  hover:(cursor-pointer bg-neutral-200)"
			onClick={props.onClick}
		>
			{props.children}
		</div>
	</div>
);

export const TransactionDetailView: React.FC = () => {
	const {
		totalPrice,
		transaction,
		transactionItem,
		goToReturPage,
		returStats,
		goToCreateRetur,
		goToPrevPage,
		generateAndOpenPdfTab,
		invoiceRef,
	} = useTransactionDetailSelector();

	return (
		transaction && (
			<>
				<Card>
					<Text.H2 tw="font-semibold text-center py-5">Transaksi</Text.H2>
					<div tw="flex flex-col space-y-2">
						<Text.H4>Name : {transaction.name}</Text.H4>
						<Text.H4>No Invoice : SB-TRN-20242501-001</Text.H4>
						<Text.H4>Status Retur : {returStats ? "Ada" : "Tidak Ada"}</Text.H4>
					</div>
					<div tw="flex flex-col space-y-2">
						<Text.H4>Barang : </Text.H4>
						<SkeletonTable data={transactionItem} titles={["Nama", "Qty", "Harga"]} />
						<div tw="flex flex-col px-10 py-2">
							<Text.H5>Harga : {convertRupiah(totalPrice)}</Text.H5>
							<Text.H5>
								Discount ({transaction.discount}%) :{" "}
								{convertRupiah((transaction.discount / 100) * totalPrice)}
							</Text.H5>
							<Text.H5>Total Akhir : {convertRupiah(transaction.totalPrice)}</Text.H5>
						</div>
					</div>
					<div tw="flex pt-3 2xl:pt-5 space-x-5 justify-center">
						<Button onClick={goToCreateRetur} buttonColor="red" disabled={returStats}>
							Retur
						</Button>
						<Button onClick={generateAndOpenPdfTab} buttonColor="blue">
							Invoice
						</Button>
						<Button onClick={goToPrevPage} buttonColor="neutral">
							Kembali
						</Button>
					</div>
				</Card>
				{transaction.return && (
					<ReturCard onClick={goToReturPage}>
						<div tw="w-full flex justify-between items-center">
							<Text.H3>Retur Detail</Text.H3>
							<Icon icon="rightArrow" size="lg" />
						</div>
					</ReturCard>
				)}
				<div
					style={{
						position: "absolute",
						left: "-99999px",
						top: "-99999px",
					}}
				>
					<TransactionInvoice
						componentRef={invoiceRef}
						data={transactionItem}
						customerName={transaction.name}
						date={transaction.created_at}
						discount={transaction.discount}
						totalPrice={transaction.totalPrice}
						invoiceNumber={transaction.invoiceNumber}
					/>
				</div>
			</>
		)
	);
};
