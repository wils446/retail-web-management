import React from "react";
import tw, { TwStyle } from "twin.macro";
import { Text } from "../text";

export type InputProps = {
	label: string;
	inline?: boolean;
	extraInputStyle?: TwStyle;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input: React.FC<InputProps> = ({ label, inline, extraInputStyle, ...inputProps }) => {
	return (
		<div tw="flex items-center space-x-2" css={[!inline && tw`flex-col space-x-0 items-start`]}>
			<Text.H4 tw="font-light mb-0.5 text-sm 2xl:text-base">{label}</Text.H4>
			<input
				css={[extraInputStyle && extraInputStyle]}
				tw="py-1 px-2 text-xs 2xl:text-sm outline-none bg-gray-50 border border-gray-300 rounded focus-visible:border-indigo-500"
				spellCheck={false}
				{...inputProps}
			/>
		</div>
	);
};
