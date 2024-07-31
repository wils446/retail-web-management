import { Table } from "@components";
import React from "react";
import "twin.macro";
import { DeleteUserModal, EditUserModal } from "./components";
import { useAdminPanelSelector } from "./hooks";

export const AdminPanelView: React.FC = () => {
	const {
		deleteUserId,
		editUserId,
		setDeleteUserId,
		setEditUserId,
		userTableData,
	} = useAdminPanelSelector();

	return (
		<div tw="h-full w-full">
			<div tw="w-[512px]">
				<Table
					titles={["username", "role"]}
					data={userTableData}
					actions={[
						{ icon: "edit", onClick: setEditUserId },
						{ icon: "trash", onClick: setDeleteUserId },
					]}
				/>
			</div>
			<EditUserModal
				isOpen={!!editUserId}
				userId={editUserId}
				closeModal={() => setEditUserId("")}
			/>
			<DeleteUserModal
				isOpen={!!deleteUserId}
				userId={deleteUserId}
				closeModal={() => setDeleteUserId("")}
			/>
		</div>
	);
};
