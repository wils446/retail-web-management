import { PDF } from "@components/pdf";
import { addHoursToLocalTime } from "@libs/utils";
import { RefObject } from "react";
import "twin.macro";

type Data = {
	Nama: string;
	Qty: number;
	Harga: string;
};

type TransactionInvoiceProps = {
	componentRef: RefObject<HTMLDivElement>;
	customerName: string;
	date: string;
	data: Data[];
	discount: number;
	totalPrice: number;
	invoiceNumber: string;
};

export const TransactionInvoice: React.FC<TransactionInvoiceProps> = (props) => {
	const date = addHoursToLocalTime(props.date, 0);

	return (
		<div ref={props.componentRef} style={{ width: "210mm", height: "297mm" }} tw="p-5 bg-white">
			<PDF.Header>
				<PDF.HeaderContentLeft>
					<PDF.Caption>Sinar Bangunan</PDF.Caption>
				</PDF.HeaderContentLeft>
				<PDF.HeaderTitle>
					<PDF.Title>I N V O I C E</PDF.Title>
					<PDF.Divider />
					<PDF.Title2>{props.invoiceNumber}</PDF.Title2>
				</PDF.HeaderTitle>
				<PDF.HeaderContentRight>
					<PDF.Caption>{props.customerName}</PDF.Caption>
				</PDF.HeaderContentRight>
			</PDF.Header>
			<PDF.Body>
				<PDF.Caption>tanggal: {date.toLocaleDateString()}</PDF.Caption>
				<PDF.Table
					data={props.data}
					titles={["Nama", "Qty", "Harga"]}
					discount={props.discount}
					totalPrice={props.totalPrice}
				/>
			</PDF.Body>
			<PDF.Footer>
				<div>
					<PDF.Caption2>Diterima Oleh</PDF.Caption2>
					<PDF.UnderlineBox />
				</div>
				<div>
					<PDF.Caption2>Diantar Oleh</PDF.Caption2>
					<PDF.UnderlineBox />
				</div>
				<div>
					<PDF.Caption2>Hormat Kami</PDF.Caption2>
					<PDF.UnderlineBox />
				</div>
			</PDF.Footer>
		</div>
	);
};
