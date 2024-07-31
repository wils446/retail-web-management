import { Icon } from "@components";
import React from "react";
import tw from "twin.macro";

type QuantityInputProps = {
	quantity: number;
	setQuantity: (count: number) => void;
	min?: number;
	max?: number;
	disable?: boolean;
};

const QuantityButton = tw.button`bg-slate-800 p-1 hover:bg-slate-950`;
const StyledQuantityInput = tw.input`w-8 2xl:w-10 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none outline-none`;

export const QuantityInput: React.FC<QuantityInputProps> = (props) => {
	return (
		<div tw="flex border border-slate-800">
			<QuantityButton
				onClick={() => props.setQuantity(props.quantity + 1)}
				disabled={props.quantity === props.max}
			>
				<Icon icon="plus" size="base" />
			</QuantityButton>
			<StyledQuantityInput
				min={props.min}
				max={props.max}
				type="number"
				value={props.quantity.toString()}
				onChange={(e) => props.setQuantity(+e.target.value)}
			/>
			<QuantityButton
				onClick={() => props.setQuantity(props.quantity - 1)}
				disabled={props.quantity === 0 || props.quantity === props.min}
			>
				<Icon icon="minus" size="base" />
			</QuantityButton>
		</div>
	);
};
