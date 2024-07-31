"use client";
import { Input, Pagination, Select, Table, Text } from "@components";
import React from "react";
import "twin.macro";
import { useTransactionTableSelector } from "../hooks";

type TransactionTableProps = {
	editActionOnClick: (id: string) => void;
};

export const TransactionTable: React.FC<TransactionTableProps> = (props) => {
	const {
		statusOnChange,
		showPagination,
		totalPage,
		router,
		searchOnChange,
		searchValue,
		status,
		modifiedTransaction,
		endDateOnChange,
		startDateOnChange,
	} = useTransactionTableSelector();

	return (
		<div tw="h-full flex flex-col ">
			<div tw="h-11 2xl:h-14 flex items-center px-5 bg-indigo-200 justify-between">
				<Input
					label=""
					placeholder="search..."
					tw="w-56 bg-white"
					value={searchValue}
					onChange={searchOnChange}
				/>
				<div tw="flex space-x-5 items-center">
					<Select
						options={["semua", "lunas", "belum lunas"]}
						value={status}
						onChange={statusOnChange}
					/>
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
				data={modifiedTransaction}
				titles={[
					"nama",
					"invoice",
					"status",
					"pembayaran",
					"total barang",
					"total harga",
					"created at",
				]}
				tableSize={[
					{ key: "created at", size: "2xl" },
					{ key: "updated at", size: "2xl" },
					{ key: "pembayaran", size: "2xl" },
					{ key: "status", size: "2xl", center: true },
					{ key: "total harga", size: "2xl" },
					{ key: "total barang", size: "2xl", center: true },
					{ key: "invoice", size: "3xl" },
				]}
				actions={[
					{
						icon: "view",
						onClick: (id) => router.push(`/app/transaction/${id}`),
					},
					{
						icon: "edit",
						onClick: props.editActionOnClick,
					},
				]}
			/>
			{showPagination && <Pagination totalPage={totalPage} />}
		</div>
	);
};
