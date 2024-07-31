import { useAppSelector, usePromiseToast } from "@libs/hooks";
import { useUpdateUserMutation } from "@libs/redux";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {
	userId: string;
	closeModal: () => void;
};

type UserValue = {
	username: string;
	password: string;
};

const initialUserValue: UserValue = {
	username: "",
	password: "",
};

export const useEditUserSelector = (props: Props) => {
	const users = useAppSelector((state) => state.usersReducer);
	const user = users.find((user) => user.id === props.userId);
	const [updateUserFn] = useUpdateUserMutation();
	const { startLoading, endLoading } = usePromiseToast();

	const [editUsername, setEditUsername] = useState(false);
	const [editPassword, setEditPassword] = useState(false);
	const [isConfirmPassword, setIsConfirmPassword] = useState(false);
	const [isPasswordWrong, setIsPasswordWrong] = useState(false);

	const [userValue, setUserValue] = useState<UserValue>(initialUserValue);

	const updateUserValue = useCallback(
		function <T extends keyof UserValue>(key: T, value: UserValue[T]) {
			setUserValue({ ...userValue, [key]: value });
		},
		[userValue]
	);

	const updateUser = useCallback(
		async (value: string) => {
			const { password, username } = userValue;
			const response = await updateUserFn({
				id: props.userId,
				username,
				password: password === "" ? undefined : password,
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
			else toast.success("user berhasil diubah");
			closeModal();
		},
		[userValue, props.userId] // eslint-disable-line react-hooks/exhaustive-deps
	);

	const initiateState = () => {
		const user = users.find((user) => user.id === props.userId);
		if (!user) return;
		updateUserValue("username", user.username);
	};

	const clearState = useCallback(() => {
		setEditUsername(false);
		setEditPassword(false);
		setIsConfirmPassword(false);
		setIsPasswordWrong(false);
		setUserValue(initialUserValue);
	}, []);

	const closeModal = useCallback(() => {
		clearState();
		props.closeModal();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(initiateState, [props.userId]);

	return {
		user,
		isConfirmPassword,
		closeModal,
		editUsername,
		userValue,
		updateUserValue,
		updateUser,
		editPassword,
		setEditPassword,
		setEditUsername,
		setIsConfirmPassword,
		isPasswordWrong,
	};
};
