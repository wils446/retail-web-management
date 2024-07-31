import { Button, Text } from "@components";
import { clearUser, resetToken } from "@libs/redux";
import "twin.macro";
import { ChangePasswordModal } from "./components";
import { useUserSelector } from "./hooks";

export const UserView: React.FC = () => {
	const { dispatch, isChangePasswordModalOpen, router, setChangePasswordModalOpen, user } =
		useUserSelector();

	return (
		user.username && (
			<div tw="h-full w-full px-3 py-1 justify-center items-center flex flex-col">
				<Text.H1 tw="font-semibold mb-5 text-5xl">{user.username}</Text.H1>
				<div tw="flex space-x-5">
					<Button buttonColor="blue" tw="px-5" onClick={() => setChangePasswordModalOpen(true)}>
						<Text.H4>Ubah Kata Sandi</Text.H4>
					</Button>
					<Button
						buttonColor="red"
						tw="px-5"
						onClick={() => {
							dispatch(resetToken());
							dispatch(clearUser());
							router.push("/");
						}}
					>
						<Text.H4>logout</Text.H4>
					</Button>
					{user.role === "admin" && (
						<Button
							buttonColor="neutral"
							tw="px-5"
							onClick={() => router.push("/app/user/admin-panel")}
						>
							<Text.H4>Manage Users</Text.H4>
						</Button>
					)}
				</div>
				<ChangePasswordModal
					isOpen={isChangePasswordModalOpen}
					closeModal={() => setChangePasswordModalOpen(false)}
				/>
			</div>
		)
	);
};
