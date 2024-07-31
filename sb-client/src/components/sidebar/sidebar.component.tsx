import { useAppSelector } from "@libs/hooks";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import "twin.macro";
import { Text } from "../text";
import { SidebarButton } from "./components";

type SidebarButton = {
	label: string;
	onClick: () => void;
};

const labelInEn = {
	Barang: "item",
	Keranjang: "cart",
	Transaksi: "transaction",
	Order: "order",
	History: "history",
	Retur: "return",
	Dashboard: "dashboard",
	Invoice: "invoice",
};

export const Sidebar: React.FC = () => {
	const router = useRouter();
	const user = useAppSelector((state) => state.userReducer);

	const buttons: SidebarButton[] = [
		{
			label: "Dashboard",
			onClick: () => router.push("/app/dashboard"),
		},
		{
			label: "Barang",
			onClick: () => router.push("/app/item"),
		},
		{
			label: "Keranjang",
			onClick: () => router.push("/app/cart"),
		},
		{
			label: "Transaksi",
			onClick: () => router.push("/app/transaction"),
		},
		{
			label: "Order",
			onClick: () => router.push("/app/order"),
		},
		{
			label: "Retur",
			onClick: () => router.push("/app/return"),
		},
		{
			label: "History",
			onClick: () => router.push("/app/history"),
		},
		{
			label: "Invoice",
			onClick: () => router.push("/app/invoice"),
		},
	];

	const labelPathName = usePathname().split("/")[2];

	useEffect(() => {
		if (!user.username) {
			router.push("/");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		user.username && (
			<div tw="w-40 2xl:w-48 h-[100dvh] bg-blue-950 flex flex-col">
				<Text.H1 tw="text-xl 2xl:text-2xl text-gray-100 font-semibold text-start py-3 2xl:py-5 px-3">
					Lorem <br /> Ipsum
				</Text.H1>
				<div tw="flex flex-col justify-between h-full py-2">
					<div tw="flex flex-col">
						{buttons.map((button, index) => (
							<SidebarButton
								key={index}
								label={button.label}
								onClickHandler={button.onClick}
								active={labelPathName === labelInEn[button.label as keyof typeof labelInEn]}
							/>
						))}
					</div>
					<div tw="w-full">
						<SidebarButton
							icon="profile"
							label={user.username}
							onClickHandler={() => {
								router.push("/app/user");
							}}
							active={labelPathName === "user"}
						/>
					</div>
				</div>
			</div>
		)
	);
};
