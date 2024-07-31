import { Input, Modal, Text } from "@components";
import React, { useState } from "react";
import "twin.macro";

type ConfirmPasswordModalProps = {
	isOpen: boolean;
	handleButtonClick: (value: string) => void;
	closeModal: () => void;
	isPasswordWrong?: boolean;
};

export const ConfirmPasswordModal: React.FC<ConfirmPasswordModalProps> = (
	props
) => {
	const [passwordValue, setPasswordValue] = useState("");

	return (
		<Modal isOpen={props.isOpen} overlayOnClick={props.closeModal}>
			<div tw="w-80">
				<Text.H2 tw="py-2 font-semibold text-center">
					Konfirmasi Password
				</Text.H2>
				<div tw="py-1 flex flex-col items-center">
					<Input
						label=""
						type="password"
						value={passwordValue}
						onChange={(e) => setPasswordValue(e.target.value)}
						onKeyDown={(e) => {
							if (e.code === "Enter") props.handleButtonClick(passwordValue);
						}}
					/>

					{props.isPasswordWrong && (
						<Text.H4 tw="text-center text-red-500">password salah!</Text.H4>
					)}
				</div>
				<div tw="py-2 flex justify-center">
					<button
						tw="w-24 py-1 bg-blue-500 hover:bg-blue-700 disabled:bg-blue-700 text-sm text-white rounded"
						onClick={() => props.handleButtonClick(passwordValue)}
						disabled={!!!passwordValue.length}
					>
						konfirmasi
					</button>
				</div>
			</div>
		</Modal>
	);
};
