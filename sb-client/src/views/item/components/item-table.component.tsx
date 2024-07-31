"use client";
import { Button, Icon, Pagination, Select, Table, Text } from "@components";
import React from "react";
import "twin.macro";
import { useItemTableSelector } from "../hooks";

type ItemTableProps = {
	onDeleteButtonClick: (id: string) => void;
	onCreateButtonClick: () => void;
	onCategoryButtonClick: () => void;
	onViewButtonClick: (id: string) => void;
	isLoading: boolean;
};

export const ItemTable: React.FC<ItemTableProps> = (props) => {
	const {
		category,
		totalPage,
		showPagination,
		categoryOptions,
		searchValueOnChange,
		categoryValueOnChange,
		modifiedItems,
		searchValue,
	} = useItemTableSelector();

	return (
		<div tw="w-full mx-auto">
			<div tw="h-11 2xl:h-14 flex items-center px-5 justify-between bg-indigo-200">
				<input
					tw="py-1 px-2.5 text-xs 2xl:text-sm rounded focus-visible:outline-indigo-500"
					placeholder="search"
					value={searchValue}
					onChange={searchValueOnChange}
				/>
				<div tw="flex space-x-2">
					<Select
						options={["Semua", ...categoryOptions]}
						defaultValue={category}
						onChange={categoryValueOnChange}
					/>
					<Button buttonColor="indigo" onClick={props.onCreateButtonClick}>
						<Icon icon="plus" size="base" />
						<Text.H5>tambah barang</Text.H5>
					</Button>
					<Button buttonColor="indigo" onClick={props.onCategoryButtonClick}>
						<Text.H5> kategori</Text.H5>
					</Button>
				</div>
			</div>
			{props.isLoading ? (
				<Table
					data={[]}
					titles={["nama", "stok", "harga", "modal", "kategori", "actions"]}
					tableSize={[
						{ key: "stok", size: "2xl" },
						{
							key: "harga",
							size: "2xl",
						},
						{
							key: "modal",
							size: "2xl",
						},
						{
							key: "kategori",
							size: "3xl",
						},
						{
							key: "actions",
							size: "xl",
						},
					]}
				/>
			) : (
				<>
					<Table
						data={modifiedItems}
						titles={["nama", "stok", "harga", "modal", "kategori"]}
						tableSize={[
							{ key: "stok", size: "2xl" },
							{
								key: "harga",
								size: "2xl",
							},
							{
								key: "modal",
								size: "2xl",
							},
							{
								key: "kategori",
								size: "3xl",
							},
						]}
						actions={[
							{ icon: "view", onClick: props.onViewButtonClick },
							{ icon: "trash", onClick: props.onDeleteButtonClick },
						]}
					/>
					{showPagination && <Pagination totalPage={totalPage} />}
				</>
			)}
		</div>
	);
};
