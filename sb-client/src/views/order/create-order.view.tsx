import { Button, Card, Icon, Input, Select, SkeletonTable, Table, Text } from "@components";
import { convertRupiah } from "@libs/utils";
import React from "react";
import "twin.macro";
import tw from "twin.macro";
import { AddOrderItemModal, EditOrderItemModal } from "./components";
import { useCreateOrderSelector } from "./hooks";

export const CreateOrderView: React.FC = () => {
	const {
		addOrderItem,
		createOrder,
		orderItems,
		setOrderItems,
		isAddOrderItemModalOpen,
		isCanOrder,
		orderName,
		setAddOrderItemModalOpen,
		setOrderName,
		setStatus,
		status,
		editOrderItemId,
		setEditOrderItemId,
		removeOrderItem,
	} = useCreateOrderSelector();

	return (
		<>
			<Card>
				<Text.H2 tw="font-semibold text-center py-5">Order Barang</Text.H2>
				<div tw="flex flex-col space-y-2 mb-10">
					<Input
						label="nama :"
						extraInputStyle={tw`w-56`}
						value={orderName}
						onChange={(e) => setOrderName(e.target.value)}
					/>
					<Select
						label="status :"
						showLabel
						options={["lunas", "belum lunas"]}
						defaultValue={status}
						onChange={(e) => setStatus(e.target.value)}
					/>

					<div className="flex flex-col">
						<div tw="flex justify-between pb-2">
							<Text.H4 tw="text-sm 2xl:text-base">Barang : </Text.H4>
							<Button onClick={() => setAddOrderItemModalOpen(true)} buttonColor="blue">
								<Icon icon="plus" size="lg" /> Tambah Barang
							</Button>
						</div>
						<SkeletonTable
							data={orderItems.map((data) => ({
								...data,
								cost: convertRupiah(data.cost),
							}))}
							titles={["name", "quantity", "cost"]}
							tableSize={[
								{ key: "quantity", size: "lg" },
								{ key: "cost", size: "2xl" },
							]}
							actions={[
								{ icon: "edit", onClick: setEditOrderItemId },
								{ icon: "trash", onClick: removeOrderItem },
							]}
						/>
						<div tw="h-7 xl:h-9 flex items-center px-10">
							<Text.H5 tw="text-xs 2xl:text-sm">
								Total Harga :{" "}
								{convertRupiah(orderItems.reduce((prev, curr) => prev + curr.cost, 0))}
							</Text.H5>
						</div>
					</div>
				</div>
				<div tw="flex justify-center">
					<Button buttonColor="blue" onClick={createOrder} disabled={!isCanOrder}>
						order
					</Button>
				</div>
			</Card>
			<AddOrderItemModal
				isOpen={isAddOrderItemModalOpen}
				closeModal={() => setAddOrderItemModalOpen(false)}
				onAddButtonClick={addOrderItem}
			/>
			<EditOrderItemModal
				isOpen={!!editOrderItemId}
				closeModal={() => setEditOrderItemId("")}
				itemId={editOrderItemId}
				orderItems={orderItems}
				setOrderItem={setOrderItems}
			/>
		</>
	);
};
