import { usePathname } from "next/navigation";
import React from "react";
import "twin.macro";
import { Text } from "../text";

export const Stack: React.FC = () => {
	const pathName = usePathname().split("/")[2];

	const title = {
		item: "Barang",
		cart: "Keranjang",
		transaction: "Transaksi",
		order: "Order",
		history: "History",
		user: "Profile",
		return: "Retur",
		dashboard: "Dashboard",
	};

	if (!pathName) return null;

	return (
		<div tw="h-10 2xl:h-12 bg-white w-full px-2 flex items-center border border-b-gray-200">
			<Text.H2 tw="text-lg 2xl:text-xl font-semibold">
				{title[pathName as keyof typeof title]}
			</Text.H2>
		</div>
	);
};
