import { Modal, Text } from "@components";
import React from "react";
import "twin.macro";
import { ConfirmPasswordModal } from ".";
import { useDeleteUserSelector } from "../hooks";

type DeleteUserModalProps = {
	isOpen: boolean;
	userId: string;
	closeModal: () => void;
};

export const DeleteUserModal: React.FC<DeleteUserModalProps> = (props) => {
	const {
		closeModal,
		deleteUser,
		isConfirmPassword,
		isDeleteUserLoading,
		isPasswordWrong,
		setIsConfirmPassword,
		user,
	} = useDeleteUserSelector({
		closeModal: props.closeModal,
		userId: props.userId,
	});

	return (
		user && (
			<>
				<Modal
					isOpen={props.isOpen && !isConfirmPassword}
					overlayOnClick={closeModal}
				>
					<div tw="p-3 flex flex-col space-y-5">
						<Text.H3 tw="text-center">menghapus user {user.username}?</Text.H3>
						<div tw="mx-auto w-52 flex justify-around space-x-5">
							<button
								tw="px-3 py-1 bg-red-500 text-white hover:bg-red-600 rounded"
								onClick={() => setIsConfirmPassword(true)}
								disabled={isDeleteUserLoading}
							>
								delete
							</button>
							<button
								tw="px-3 py-1 bg-gray-800 text-white hover:bg-gray-950 rounded"
								onClick={props.closeModal}
								disabled={isDeleteUserLoading}
							>
								cancel
							</button>
						</div>
					</div>
				</Modal>
				<ConfirmPasswordModal
					isOpen={isConfirmPassword}
					closeModal={() => setIsConfirmPassword(false)}
					handleButtonClick={deleteUser}
					isPasswordWrong={isPasswordWrong}
				/>
			</>
		)
	);
};
