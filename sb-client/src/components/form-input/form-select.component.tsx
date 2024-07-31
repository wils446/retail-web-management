import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
	FieldErrors,
	FieldValues,
	Path,
	UseFormRegister,
} from "react-hook-form";
import { TwStyle } from "twin.macro";
import { CustomErrorMessage } from ".";
import { Text } from "../text";

type FormInputProps<T extends FieldValues> = {
	label: Path<T>;
	register: UseFormRegister<T>;
	errors: FieldErrors<T>;
	error?: FetchBaseQueryError | SerializedError | undefined;
	customErrorMessage?: CustomErrorMessage<T>[];
	extraStyles?: TwStyle;
	defaultValue: string;
	options: string[];
};

export function FormSelect<T extends FieldValues>(props: FormInputProps<T>) {
	return (
		<div tw="flex flex-col">
			<Text.H4 tw="font-light mb-0.5">{props.label}</Text.H4>
			<select
				tw="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-900 focus:border-gray-900 focus-visible:outline-gray-900 block w-auto py-2 px-2"
				css={[props.extraStyles && props.extraStyles]}
				defaultValue={props.defaultValue}
				{...props.register(props.label, { required: true })}
			>
				<option value={props.defaultValue}>{props.defaultValue}</option>
				{props.options!.map((option, index) => (
					<option key={index} value={option}>
						{option}
					</option>
				))}
			</select>
		</div>
	);
}
