import { convertRupiah } from "@libs/utils";
import { useMemo } from "react";
import tw, { TwStyle } from "twin.macro";
import { Divider } from "./pdf.component";

type TableSizeVariants = "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "lg";

const tableSizeVariants: Record<TableSizeVariants, TwStyle> = {
	lg: tw`w-20`,
	xl: tw`w-24`,
	"2xl": tw`w-36`,
	"3xl": tw`w-48`,
	"4xl": tw`w-60`,
	"5xl": tw`w-72`,
	"6xl": tw`w-80`,
	"7xl": tw`w-96`,
};

type TableSize<T> = {
	key: T;
	size: TableSizeVariants;
	center?: boolean;
};

type TableDataType = Record<string, string | number | undefined>;

type TableProps<T extends TableDataType[]> = {
	data: T;
	tableSize?: TableSize<keyof T[0]>[];
	titles: (keyof T[number])[];
	page?: number;
	pageLength?: number;
	discount?: number;
	totalPrice: number;
};

const blankDataObj = {
	Nama: "blank",
	Qty: 0,
	Harga: "blank",
} as TableDataType;

const SkeletonStyledTh = tw.th`text-base  font-semibold text-start`;
const SkeletonStyledTd = tw.td`text-xs text-start h-6`;
const SmallSkeletonStyledTd = tw.td`text-xs text-start px-2 h-6`;

export function SkeletonTable<T extends TableDataType[]>(props: TableProps<T>) {
	const tableData = useMemo(() => {
		if (props.data.length < 3) {
			const tempData = [];
			for (let i = 0; i < 3; i++) {
				if (props.data[i]) tempData.push(props.data[i]);
				else tempData.push(blankDataObj);
			}
			return tempData as TableDataType[];
		}

		return props.data;
	}, [props.data]);

	return (
		<div tw="w-full">
			<Divider />
			<table tw="w-full my-2">
				<thead>
					<tr>
						<SkeletonStyledTh tw="w-8">
							<h1 tw="px-2 -mt-2 mb-2">#</h1>
							<Divider />
						</SkeletonStyledTh>
						{props.titles.map((title, index) => {
							const size = props.tableSize?.find((table) => table.key === title) || null;

							return (
								<SkeletonStyledTh
									css={[
										size && tableSizeVariants[size.size],
										size && size.center && tw`text-center`,
									]}
									key={index}
								>
									<h1 tw="px-2 -mt-2 mb-2">{title as string}</h1>
									<Divider />
								</SkeletonStyledTh>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{tableData.map((data, dataIndex) => (
						<tr
							key={dataIndex}
							// css={[i === props.data.length - 1 && tw`border-b border-neutral-800`]}
						>
							<SkeletonStyledTd>
								<h1 tw="px-2" css={[dataIndex === tableData.length - 1 && tw`mb-4`]}>
									{dataIndex + 1}
								</h1>
								{dataIndex === tableData.length - 1 && <Divider css={[tw`border-black`]} />}
							</SkeletonStyledTd>
							{props.titles.map((title, i) => {
								const size = props.tableSize?.find((table) => table.key === title) || null;
								return (
									<SkeletonStyledTd css={[size && size.center && tw`text-center`]} key={i}>
										<h1
											tw="px-2"
											css={[
												(!data[title as number] || data[title as string] === "blank") &&
													tw`text-white`,
												dataIndex === tableData.length - 1 && tw`mb-4`,
											]}
										>
											{/*  */}
											{data[title]}
										</h1>
										{dataIndex === tableData.length - 1 && <Divider css={[tw`border-black`]} />}
									</SkeletonStyledTd>
								);
							})}
						</tr>
					))}
					{props.discount !== undefined && (
						<tr>
							<SmallSkeletonStyledTd></SmallSkeletonStyledTd>
							<SmallSkeletonStyledTd>Diskon</SmallSkeletonStyledTd>
							<SmallSkeletonStyledTd>{props.discount}%</SmallSkeletonStyledTd>
							<SmallSkeletonStyledTd>
								{convertRupiah((props.discount / 100) * props.totalPrice)}
							</SmallSkeletonStyledTd>
						</tr>
					)}
					<tr>
						<SmallSkeletonStyledTd></SmallSkeletonStyledTd>
						<SmallSkeletonStyledTd>Total</SmallSkeletonStyledTd>
						<SmallSkeletonStyledTd></SmallSkeletonStyledTd>
						<SmallSkeletonStyledTd>{convertRupiah(props.totalPrice)}</SmallSkeletonStyledTd>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
