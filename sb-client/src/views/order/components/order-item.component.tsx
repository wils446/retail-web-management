import { Text } from "@components";
import { convertRupiah } from "@libs/utils";
import React from "react";
import "twin.macro";

type OrderItemProps = {
	itemName: string;
	itemQty: number;
	itemCost: number;
};

export const OrderItem: React.FC<OrderItemProps> = (props) => (
	<div tw="h-12 flex items-center px-2 justify-between">
		<Text.H4>{props.itemName}</Text.H4>
		<div tw="flex space-x-4">
			<Text.H4>x{props.itemQty}</Text.H4>
			<Text.H4>{convertRupiah(props.itemCost)}</Text.H4>
		</div>
	</div>
);
