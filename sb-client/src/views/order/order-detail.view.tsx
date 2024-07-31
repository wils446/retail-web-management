import { Button, Card, Icon, SkeletonTable, Text } from "@components";
import "twin.macro";
import { OrderInvoice } from "./components";
import { useOrderDetailSelector } from "./hooks";

const ReturCard = (props: { children: React.ReactNode; onClick?: () => void }) => (
	<div tw="flex justify-center">
		<div
			tw="bg-white w-[660px] 2xl:w-[768px] border px-3 py-2 rounded  hover:(cursor-pointer bg-neutral-200)"
			onClick={props.onClick}
		>
			{props.children}
		</div>
	</div>
);

export const OrderDetailView: React.FC = () => {
	const {
		order,
		orderItems,
		goToCreateRetur,
		goToPrevPage,
		totalPrice,
		isReturButtonDisabled,
		goToReturPage,
		paidStatus,
		generateAndOpenPdfTab,
		invoiceRef,
	} = useOrderDetailSelector();

	return (
		order && (
			<>
				<Card>
					<Text.H2 tw="font-semibold text-center py-5">Order</Text.H2>
					<div tw="flex flex-col space-y-2 pb-2">
						<Text.H4>Name : {order.name}</Text.H4>
						<Text.H4>No Invoice : {order.invoiceNumber}</Text.H4>
						<Text.H4>Pembayaran : {paidStatus}</Text.H4>
					</div>
					<div tw="flex flex-col space-y-2">
						<Text.H4>Barang : </Text.H4>
						<SkeletonTable data={orderItems} titles={["Nama", "Qty", "Harga"]} />
						<div tw="flex flex-col px-10 py-2">
							<Text.H5>Total Harga : {totalPrice}</Text.H5>
						</div>
					</div>
					<div tw="flex pt-3 2xl:pt-5 space-x-5 justify-center">
						<Button onClick={goToCreateRetur} buttonColor="red" disabled={isReturButtonDisabled}>
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
				{order.return && (
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
					<OrderInvoice
						componentRef={invoiceRef}
						data={orderItems}
						date={order.created_at}
						sellerName={order.name}
						totalPrice={order.items.reduce((prev, curr) => prev + curr.cost, 0)}
						invoiceNumber={order.invoiceNumber}
					/>
				</div>
			</>
		)
	);
};
