import { Text } from "@components";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { HTMLInputTypeAttribute } from "react";
import {
	FieldErrors,
	FieldValues,
	Path,
	UseFormRegister,
} from "react-hook-form";
import "twin.macro";

export type CustomErrorMessage<T extends FieldValues> = {
	status: number;
	message: string;
	label?: keyof T;
};

type FormInputProps<T extends FieldValues> = {
	label: Path<T>;
	register: UseFormRegister<T>;
	type: HTMLInputTypeAttribute;
	errors: FieldErrors<T>;
	error?: FetchBaseQueryError | SerializedError | undefined;
	customErrorMessage?: CustomErrorMessage<T>[];
};

export function FormInput<T extends FieldValues>(
	props: FormInputProps<T>
): JSX.Element {
	let errorMessage;

	if (
		props.errors[props.label] &&
		props.errors[props.label]?.type === "required"
	)
		errorMessage = `${props.label} is required!`;

	if (props.error && "status" in props.error && props.customErrorMessage) {
		const status = props.error.status;
		const error = props.customErrorMessage.find((err) => err.status === status);
		if (error?.label) {
			if (props.label === error.label) errorMessage = error.message;
		} else {
			errorMessage = error?.message;
		}
	}

	return (
		<div tw="flex flex-col">
			<Text.H4 tw="font-light mb-0.5">{props.label}</Text.H4>
			<input
				tw="py-0.5 px-1 outline-none"
				spellCheck={false}
				type={props.type}
				{...props.register(props.label, { required: true })}
			/>
			{errorMessage && <Text.H5 tw="text-red-500">{errorMessage}</Text.H5>}
		</div>
	);
}
