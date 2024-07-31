import { Button, Input, Modal, Text } from "@components";
import React from "react";
import "twin.macro";
import tw from "twin.macro";
import { useChangePasswordSelector } from "../hooks";

type ChangePasswordModalProps = {
	isOpen: boolean;
	closeModal: () => void;
};

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = (
	props
) => {
	const {
		changePasswordValue,
		closeModal,
		isPasswordWrong,
		showValidateError,
		updatePassword,
		updatePasswordValue,
	} = useChangePasswordSelector({
		closeModal: props.closeModal,
	});

	return (
		<Modal isOpen={props.isOpen} overlayOnClick={closeModal}>
			<div tw="w-80 px-5">
				<Text.H3 tw="font-semibold py-5 text-center">
					Mengubah Kata Sandi
				</Text.H3>
				<div tw="flex flex-col space-y-3">
					<div>
						<Input
							label="New Password"
							value={changePasswordValue.newPassword}
							onChange={(e) =>
								updatePasswordValue("newPassword", e.target.value)
							}
							type="password"
							extraInputStyle={tw`w-full`}
							required
						/>
						{showValidateError && (
							<Text.H5 tw="text-red-500">
								minimal panjang password 8 huruf atau angka
							</Text.H5>
						)}
					</div>
					<div>
						<Input
							label="Old Password"
							value={changePasswordValue.oldPassword}
							onChange={(e) =>
								updatePasswordValue("oldPassword", e.target.value)
							}
							type="password"
							extraInputStyle={tw`w-full`}
							required
						/>
						{isPasswordWrong && (
							<Text.H5 tw="text-red-500">password salah</Text.H5>
						)}
					</div>
				</div>
				<div tw="flex space-x-5 py-5 justify-center">
					<Button
						buttonColor="blue"
						onClick={updatePassword}
						disabled={
							!(
								!!changePasswordValue.newPassword &&
								!!changePasswordValue.oldPassword
							)
						}
					>
						ubah
					</Button>
					<Button buttonColor="neutral" onClick={closeModal}>
						batal
					</Button>
				</div>
			</div>
		</Modal>
	);
};
