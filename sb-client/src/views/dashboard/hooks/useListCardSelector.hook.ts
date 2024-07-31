import { useAppSelector } from "@libs/hooks";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

type ListType = "Transaksi" | "Order";

export const useListCardSelector = (type: ListType) => {
	const dailyReport = useAppSelector((state) => state.dailyReportReducer);
	const router = useRouter();

	const list = useMemo(() => {
		if (type === "Order") {
			return dailyReport.orders.data.map((data) => ({
				id: data.id,
				name: data.name,
				timestamp: new Date(data.createdAt).toLocaleTimeString(),
			}));
		} else {
			return dailyReport.transactions.data.map((data) => ({
				id: data.id,
				name: data.name,
				timestamp: new Date(data.createdAt).toLocaleTimeString(),
			}));
		}
	}, [type, dailyReport]);

	const listOnClick = (list: ListType, id: string) => {
		if (list === "Order") router.push(`order/${id}`);
		else router.push(`transaction/${id}`);
	};

	return { list, listOnClick };
};
