import { Icon } from "@components";
import { useQueryString } from "@libs/hooks";
import { useMemo } from "react";
import "twin.macro";
import tw, { TwStyle } from "twin.macro";

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

type TableAction = {
	icon: Icon;
	onClick: (id: string) => void;
};

type TableDataType = Record<string, string | number | undefined>;

type TableProps<T extends TableDataType[]> = {
	data: T;
	tableSize?: TableSize<keyof T[0]>[];
	titles: (keyof T[number])[];
	actions?: TableAction[];
	pageLength?: number;
};

const StyledTh = tw.th`border-gray-600 px-2 py-1 text-base 2xl:text-lg font-semibold text-indigo-800 text-start`;
const StyledTd = tw.td`text-xs 2xl:text-sm text-start px-2 py-1 2xl:h-9`;

export function Table<T extends TableDataType[]>(props: TableProps<T>) {
	const { searchParams } = useQueryString();

	const startNumber = useMemo(
		() => (+(searchParams.get("page") || 1) - 1) * (props.pageLength || 20) + 1,
		[searchParams, props.pageLength]
	);

	return (
		<div tw="w-full rounded-lg select-none">
			<table tw="w-full border border-indigo-200">
				<thead tw="bg-indigo-100">
					<tr tw="">
						<StyledTh tw="text-center w-14">#</StyledTh>
						{props.titles.map((title, index) => {
							const size = props.tableSize?.find((table) => table.key === title) || null;
							return (
								<StyledTh
									css={[
										size && tableSizeVariants[size.size],
										size && size.center && tw`text-center`,
									]}
									key={index}
								>
									{title as string}
								</StyledTh>
							);
						})}
						{props.actions && <StyledTh tw="w-24 text-center">actions</StyledTh>}
					</tr>
				</thead>
				<tbody>
					{props.data.map((item, index) => (
						<tr tw="odd:bg-gray-50 even:bg-indigo-50" key={index}>
							<StyledTd tw="text-center" key={index}>
								{startNumber + index}
							</StyledTd>
							{props.titles.map((title, index) => {
								const size = props.tableSize?.find((table) => table.key === title) || null;
								return (
									<StyledTd key={index} css={[size && size.center && tw`text-center`]}>
										{item[title]}
									</StyledTd>
								);
							})}
							{props.actions && (
								<StyledTd tw="text-center">
									<div tw="flex space-x-2 justify-center">
										{props.actions.map((action, id) => (
											<button key={id} onClick={() => action.onClick(item.id as string)}>
												<Icon size="lg" icon={action.icon} />
											</button>
										))}
									</div>
								</StyledTd>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

const SkeletonStyledTh = tw.th`px-2 text-base 2xl:text-lg font-semibold text-start`;
const SkeletonStyledTd = tw.td`text-xs 2xl:text-sm text-start px-2 h-7 2xl:h-9`;

export function SkeletonTable<T extends TableDataType[]>(props: TableProps<T>) {
	return (
		<div tw="w-full">
			<table tw="w-full border-b border-neutral-400">
				<thead tw="border-y border-neutral-400">
					<tr>
						<SkeletonStyledTh tw="w-8">#</SkeletonStyledTh>
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
									{title as string}
								</SkeletonStyledTh>
							);
						})}
						{props.actions && <SkeletonStyledTh tw="w-10 text-center"></SkeletonStyledTh>}
					</tr>
				</thead>
				<tbody>
					{props.data.map((data, i) => (
						<tr key={i}>
							<SkeletonStyledTd>{i + 1}</SkeletonStyledTd>
							{props.titles.map((title, i) => {
								const size = props.tableSize?.find((table) => table.key === title) || null;
								return (
									<SkeletonStyledTd css={[size && size.center && tw`text-center`]} key={i}>
										{data[title]}
									</SkeletonStyledTd>
								);
							})}
							{props.actions && (
								<SkeletonStyledTd>
									<div tw="flex space-x-2 justify-center">
										{props.actions.map((action, i) => (
											<button key={i} onClick={() => action.onClick(data.id as string)}>
												<Icon size="lg" icon={action.icon} />
											</button>
										))}
									</div>
								</SkeletonStyledTd>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
