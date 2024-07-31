"use client";
import { Input, Pagination, Select, Table, Text } from "@components";
import "twin.macro";
import { useReturnTableSelector } from "../hooks";

export const ReturnTable: React.FC = () => {
	const {
		modifiedReturns,
		showPagination,
		totalPage,
		router,
		search,
		searchOnChange,
		type,
		typeOnChange,
		endDateOnChange,
		startDateOnChange,
	} = useReturnTableSelector();

	return (
		<div>
			<div tw="h-11 2xl:h-14 flex items-center px-5 bg-indigo-200 justify-between">
				<div tw="flex space-x-4">
					<Input
						label=""
						placeholder="search..."
						tw="w-56 bg-white"
						value={search}
						onChange={searchOnChange}
					/>
				</div>
				<div tw="flex space-x-5 items-center">
					<Select options={["semua", "order", "transaksi"]} value={type} onChange={typeOnChange} />
					<div tw="flex space-x-2">
						<Text.H3 tw="text-base 2xl:text-lg">Date : </Text.H3>
						<input
							tw="rounded px-1 text-xs 2xl:text-base"
							type="date"
							onChange={startDateOnChange}
						/>
						<input tw="rounded px-1 text-xs 2xl:text-base" type="date" onChange={endDateOnChange} />
					</div>
				</div>
			</div>
			<Table
				data={modifiedReturns}
				titles={["name", "invoice", "type", "jumlah barang", "created at"]}
				tableSize={[
					{
						key: "invoice",
						size: "3xl",
					},
					{
						key: "jumlah barang",
						size: "3xl",
					},
					{
						key: "type",
						size: "2xl",
					},
					{
						key: "created at",
						size: "3xl",
					},
				]}
				actions={[
					{
						icon: "view",
						onClick: (id) => router.push(`/app/return/${id}`),
					},
				]}
			/>
			{showPagination && <Pagination totalPage={totalPage} />}
		</div>
	);
};
