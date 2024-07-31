import { useAppDispatch, useAppSelector } from "@libs/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useUserSelector = () => {
	const router = useRouter();
	const user = useAppSelector((state) => state.userReducer);
	const dispatch = useAppDispatch();

	const [isChangePasswordModalOpen, setChangePasswordModalOpen] =
		useState(false);

	useEffect(() => {
		if (!user.id) {
			router.push("/");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {
		user,
		dispatch,
		router,
		isChangePasswordModalOpen,
		setChangePasswordModalOpen,
	};
};
