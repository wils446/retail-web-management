import { useLogin } from "@libs/hooks";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import "twin.macro";
import { CustomErrorMessage, FormInput } from ".";

type FormInputs = { username: string; password: string };

export const LoginForm: React.FC = () => {
	const { error, isLoading, login } = useLogin();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormInputs>();
	const onSubmit: SubmitHandler<FormInputs> = (data) => {
		login(data.username, data.password);
	};

	const customErrorHandler: CustomErrorMessage<FormInputs>[] = [
		{ status: 404, message: "user is not registered!", label: "username" },
		{
			status: 401,
			message: "password is wrong!",
			label: "password",
		},
	];

	return (
		<form tw="flex flex-col space-y-4" onSubmit={handleSubmit(onSubmit)}>
			<FormInput
				label="username"
				type="text"
				register={register}
				errors={errors}
				error={error}
				customErrorMessage={customErrorHandler}
			/>
			<FormInput
				label="password"
				type="password"
				register={register}
				errors={errors}
				error={error}
				customErrorMessage={customErrorHandler}
			/>
			<div>
				<input
					tw="bg-green-500 text-white text-center w-full py-1 mt-2 hover:(bg-green-600 cursor-pointer) disabled:(bg-green-600 cursor-default)"
					type="submit"
					value="login"
					disabled={isLoading}
				/>
			</div>
		</form>
	);
};
