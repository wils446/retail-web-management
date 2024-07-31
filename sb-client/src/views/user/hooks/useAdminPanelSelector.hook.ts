import { useAppSelector } from "@libs/hooks";
import { useLazyGetUsersQuery } from "@libs/redux";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export const useAdminPanelSelector = () => {
	const router = useRouter();
	const [getUsers] = useLazyGetUsersQuery();
	const user = useAppSelector((state) => state.userReducer);
	const users = useAppSelector((state) => state.usersReducer);

	const [editUserId, setEditUserId] = useState("");
	const [deleteUserId, setDeleteUserId] = useState("");

	const userTableData = useMemo(
		() =>
			users
				.map((user) => ({
					id: user.id,
					role: user.role,
					username: user.username,
				}))
				.filter((userData) => userData.id !== user.id),
		[users, user.id]
	);

	useEffect(() => {
		if (user.role !== "admin") router.push("/app/user");
		getUsers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {
		editUserId,
		deleteUserId,
		setEditUserId,
		setDeleteUserId,
		userTableData,
	};
};
