"use client";
import { Button, Icon, Input, Pagination, Select, Table, Text } from "@components";
import React from "react";
import "twin.macro";
import { useOrderTableSelector } from "../hooks";

type OrderTableProps = {
	onEditButtonClick: (id: string) => void;
};

export const OrderTable: React.FC<OrderTableProps> = (props) => {
	const {
		modifiedOrders,
		router,
		showPagination,
		totalPage,
		endDateOnChange,
		startDateOnChange,
		searchOnChange,
		status,
		statusOnChange,
		searchValue,
	} = useOrderTableSelector();

	return (
		<div>
			<div tw="h-11 2xl:h-14 flex items-center px-5 bg-indigo-200 justify-between">
				<div tw="flex space-x-4 items-center">
					<Input
						label=""
						placeholder="search..."
						tw="w-56 bg-white"
						value={searchValue}
						onChange={searchOnChange}
					/>
					<Button buttonColor="indigo" onClick={() => router.push("/app/order/create-order")}>
						<Icon icon="plus" size="base" />
						<Text.H5>order barang</Text.H5>
					</Button>
				</div>
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
				data={modifiedOrders}
				titles={[
					"name",
					"invoice",
					"status",
					"pembayaran",
					"total barang",
					"total harga",
					"created at",
				]}
				tableSize={[
					{ key: "pembayaran", size: "2xl" },
					{ key: "total barang", size: "2xl" },
					{ key: "status", size: "2xl" },
					{ key: "total harga", size: "2xl" },
					{ key: "invoice", size: "3xl" },
					{ key: "created at", size: "2xl" },
				]}
				actions={[
					{ icon: "view", onClick: (id) => router.push(`/app/order/${id}`) },
					{ icon: "edit", onClick: props.onEditButtonClick },
				]}
			/>
			{showPagination && <Pagination totalPage={totalPage} />}
		</div>
	);
};
