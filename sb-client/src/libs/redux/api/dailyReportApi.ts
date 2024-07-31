import { api } from "./api";

export type DailyReportDataResponse = {
	id: string;
	name: string;
	totalPriceOrCost: number;
	totalItems: number;
	createdAt: Date;
};

export type DailyReportSubResponse = {
	data: DailyReportDataResponse[];
	count: number;
};

export type DailyReportResponse = {
	transactions: DailyReportSubResponse;
	orders: DailyReportSubResponse;
	orderReturns: DailyReportSubResponse;
	transactionReturns: DailyReportSubResponse;
};

export const dailyReportApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getDailyReport: builder.query<DailyReportResponse, void>({
			query: () => "/daily-report",
		}),
	}),
});

export const { useGetDailyReportQuery, useLazyGetDailyReportQuery } = dailyReportApi;
