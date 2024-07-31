import { useUpdatePasswordMutation } from "@libs/redux";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";

type ChangePasswordState = {
	newPassword: string;
	oldPassword: string;
};

type Props = {
	closeModal: () => void;
};

const initialChangePasswordState: ChangePasswordState = {
	newPassword: "",
	oldPassword: "",
};

export const useChangePasswordSelector = (props: Props) => {
	const [updatePasswordFn, { isLoading: isUpdatePasswordLoading }] =
		useUpdatePasswordMutation();

	const [isPasswordWrong, setPasswordWrong] = useState(false);
	const [showValidateError, setShowValidateError] = useState(false);
	const [changePasswordValue, setChangePasswordValue] =
		useState<ChangePasswordState>(initialChangePasswordState);

	const isPasswordValid = useMemo(
		() => changePasswordValue.newPassword.length >= 6,
		[changePasswordValue.newPassword]
	);

	const updatePasswordValue = useCallback(
		function <T extends keyof ChangePasswordState>(
			key: T,
			value: ChangePasswordState[T]
		) {
			setChangePasswordValue({ ...changePasswordValue, [key]: value });
		},
		[changePasswordValue]
	);

	const updatePassword = useCallback(async () => {
		const { newPassword, oldPassword } = changePasswordValue;
		if (!isPasswordValid) {
			setShowValidateError(true);
			return;
		}

		setShowValidateError(false);
		try {
			await updatePasswordFn({
				newPassword,
				oldPassword,
			}).unwrap();
			toast.success("password changed");
			closeModal();
		} catch (err) {
			const statusCode = (err as FetchBaseQueryError).status;
			if (statusCode === 400) {
			} else if (statusCode === 401) {
				setPasswordWrong(true);
			}
		}
	}, [changePasswordValue]); // eslint-disable-line react-hooks/exhaustive-deps

	const clearInput = useCallback(() => {
		setChangePasswordValue(initialChangePasswordState);
		setPasswordWrong(false);
		setShowValidateError(false);
	}, []);

	const closeModal = useCallback(() => {
		if (isUpdatePasswordLoading) return;
		props.closeModal();
		clearInput();
	}, [isUpdatePasswordLoading]); // eslint-disable-line react-hooks/exhaustive-deps

	return {
		closeModal,
		changePasswordValue,
		showValidateError,
		isPasswordWrong,
		updatePassword,
		updatePasswordValue,
	};
};
