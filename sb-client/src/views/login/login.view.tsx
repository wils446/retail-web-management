import { Text } from "@components";
import React from "react";
import "twin.macro";
import { LoginForm } from "./components";

export const LoginView: React.FC = () => {
	return (
		<div tw="h-[100dvh] w-full flex justify-center items-center">
			<div tw="w-80 border border-gray-400 py-7 px-5">
				<Text.H1 tw="font-bold text-3xl text-center mb-7">Login</Text.H1>
				<LoginForm />
			</div>
		</div>
	);
};
