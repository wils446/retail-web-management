"use client";
import { Pagination, Select, Table, Text } from "@components";
import React from "react";
import "twin.macro";
import { useHistoryTableSelector } from "../hooks";

export const HistoryTable: React.FC = () => {
	const {
		modifiedHistories,
		showPagination,
		totalPage,
		endDateOnChange,
		startDateOnChange,
		type,
		typeOnChange,
	} = useHistoryTableSelector();

	return (
		<div tw="w-full">
			<div tw="h-11 2xl:h-14 flex items-center px-5 bg-indigo-200 justify-between">
				<div tw="flex space-x-2">
					<Text.H3 tw="text-base 2xl:text-lg">Date : </Text.H3>
					<input tw="rounded px-1 text-xs 2xl:text-base" type="date" onChange={startDateOnChange} />
					<input tw="rounded px-1 text-xs 2xl:text-base" type="date" onChange={endDateOnChange} />
				</div>
				<Select
					options={["semua", "create", "update", "delete"]}
					onChange={typeOnChange}
					value={type}
				/>
			</div>
			<Table
				data={modifiedHistories}
				titles={["waktu dan tanggal", "keterangan", "jenis"]}
				tableSize={[
					{ key: "waktu dan tanggal", size: "5xl" },
					{ key: "jenis", size: "xl", center: true },
				]}
			/>
			{showPagination && <Pagination totalPage={totalPage} />}
		</div>
	);
};
