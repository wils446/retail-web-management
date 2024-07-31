import { Button, Icon, Input, Modal, Text } from "@components";
import React from "react";
import "twin.macro";
import tw from "twin.macro";
import { ConfirmPasswordModal } from ".";
import { useEditUserSelector } from "../hooks";

type EditUserModalProps = {
	isOpen: boolean;
	userId: string;
	closeModal: () => void;
};

export const EditUserModal: React.FC<EditUserModalProps> = (props) => {
	const {
		closeModal,
		editPassword,
		editUsername,
		isConfirmPassword,
		isPasswordWrong,
		setEditPassword,
		setEditUsername,
		setIsConfirmPassword,
		updateUser,
		updateUserValue,
		user,
		userValue,
	} = useEditUserSelector({
		closeModal: props.closeModal,
		userId: props.userId,
	});

	return (
		user && (
			<>
				<Modal isOpen={props.isOpen && !isConfirmPassword} overlayOnClick={closeModal}>
					<div tw="w-96 px-3">
						<Text.H2 tw="text-center font-semibold py-2">User</Text.H2>
						<hr />
						<div tw="flex flex-col py-2 space-y-2">
							{editUsername ? (
								<Input
									label="Nama : "
									inline
									value={userValue.username}
									onChange={(e) => updateUserValue("username", e.target.value)}
									extraInputStyle={tw`flex-grow`}
								/>
							) : (
								<div tw="flex space-x-2 items-center">
									<Text.H4>Nama : {user.username}</Text.H4>
									<button onClick={() => setEditUsername(true)}>
										<Icon icon="edit" size="lg" />
									</button>
								</div>
							)}
							{editPassword ? (
								<Input
									label="Password : "
									inline
									type="password"
									extraInputStyle={tw`flex-grow`}
									value={userValue.password}
									onChange={(e) => updateUserValue("password", e.target.value)}
								/>
							) : (
								<div tw="flex space-x-2">
									<Text.H4>Password : </Text.H4>
									<button
										tw="bg-slate-700 text-sm rounded px-2 text-white border border-slate-900 hover:(bg-slate-900)"
										onClick={() => setEditPassword(true)}
									>
										ganti password
									</button>
								</div>
							)}
						</div>
						<div tw="flex space-x-4 justify-center py-2">
							<Button buttonColor="blue" onClick={() => setIsConfirmPassword(true)}>
								ubah
							</Button>
							<Button buttonColor="red" onClick={closeModal}>
								batal
							</Button>
						</div>
					</div>
				</Modal>
				<ConfirmPasswordModal
					isOpen={isConfirmPassword}
					closeModal={() => setIsConfirmPassword(false)}
					handleButtonClick={updateUser}
					isPasswordWrong={isPasswordWrong}
				/>
			</>
		)
	);
};
