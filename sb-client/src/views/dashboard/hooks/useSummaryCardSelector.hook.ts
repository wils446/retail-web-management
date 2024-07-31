import { useAppSelector } from "@libs/hooks";
import { convertRupiah } from "@libs/utils";
import { useMemo } from "react";

const typeKey = {
	transactions: "Transaksi",
	orders: "Order",
	orderReturns: "Retur Order",
	transactionReturns: "Retur Transaksi",
};

export const useSummaryCardSelector = () => {
	const dailyReport = useAppSelector((state) => state.dailyReportReducer);

	const summaryData = useMemo(
		() =>
			Object.entries(dailyReport).map(([key, value]) => ({
				counts: value.count,
				totalPriceOrCost: convertRupiah(
					value.data.reduce((prev, curr) => prev + curr.totalPriceOrCost, 0)
				),
				totalItems: value.data.reduce((prev, curr) => prev + curr.totalItems, 0),
				type: typeKey[key as keyof typeof typeKey],
			})),
		[dailyReport]
	);

	const date = useMemo(() => new Date().toLocaleDateString(), []);

	return { summaryData, date };
};
