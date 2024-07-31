import { useLazyGetDailyReportQuery } from "@libs/redux";
import { useEffect } from "react";

export const useDashboardSelector = () => {
	const [getDailyReport] = useLazyGetDailyReportQuery();

	useEffect(() => {
		getDailyReport();
	}, []);
};
