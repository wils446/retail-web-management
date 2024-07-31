import React from "react";
import "twin.macro";
import tw, { TwStyle } from "twin.macro";
import { Text } from "../text";

type SelectProps = {
	options: string[];
	showLabel?: boolean;
	label?: string;
	extraSelectStyle?: TwStyle;
	inline?: boolean;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select: React.FC<SelectProps> = ({
	label,
	showLabel,
	options,
	extraSelectStyle,
	inline,
	...selectProps
}) => {
	const isDefaultValueOnOptions =
		options.findIndex((option) => option === selectProps.defaultValue || selectProps.value) != -1;

	return (
		<div tw="flex space-x-2 items-center" css={[!inline && tw`flex-col items-start space-x-0`]}>
			{showLabel && <Text.H4 tw="font-light mb-0.5">{label}</Text.H4>}
			<select
				tw="bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 focus-visible:outline-indigo-500 block w-auto py-1.5 px-2"
				css={[extraSelectStyle && extraSelectStyle]}
				{...selectProps}
			>
				{!isDefaultValueOnOptions && (
					<option value={selectProps.defaultValue}>{selectProps.defaultValue}</option>
				)}
				{options.map((option, index) => (
					<option key={index} value={option}>
						{option}
					</option>
				))}
			</select>
		</div>
	);
};
