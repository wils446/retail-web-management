import { useAppSelector } from "@libs/hooks";
import { useDeleteUserMutation } from "@libs/redux";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

type Props = {
	userId: string;
	closeModal: () => void;
};

export const useDeleteUserSelector = (props: Props) => {
	const [deleteUserFn, { isLoading: isDeleteUserLoading }] =
		useDeleteUserMutation();
	const user = useAppSelector((state) => state.usersReducer).find(
		(user) => user.id === props.userId
	);

	const [isConfirmPassword, setIsConfirmPassword] = useState(false);
	const [isPasswordWrong, setIsPasswordWrong] = useState(false);

	const deleteUser = useCallback(
		async (value: string) => {
			const response = await deleteUserFn({
				userId: props.userId,
				adminPassword: value,
			});

			if (
				"error" in response &&
				"status" in response.error &&
				response.error.status === 401
			) {
				setIsPasswordWrong(true);
				return;
			}

			if ("error" in response) toast.error("Terjadi Kesalahan");
			else toast.success("user berhasil dihapus");

			closeModal();
		},
		[props.userId] // eslint-disable-line react-hooks/exhaustive-deps
	);

	const clearState = useCallback(() => {
		setIsConfirmPassword(false);
		setIsPasswordWrong(false);
	}, []);

	const closeModal = useCallback(() => {
		if (isDeleteUserLoading) return;
		clearState();
		props.closeModal();
	}, [isDeleteUserLoading]); // eslint-disable-line react-hooks/exhaustive-deps

	return {
		user,
		isConfirmPassword,
		closeModal,
		setIsConfirmPassword,
		isDeleteUserLoading,
		deleteUser,
		isPasswordWrong,
	};
};
