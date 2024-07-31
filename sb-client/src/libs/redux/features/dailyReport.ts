import { createSlice } from "@reduxjs/toolkit";
import { DailyReportResponse, dailyReportApi } from "../api";

type DailyReportState = DailyReportResponse;

const subInitialState = {
	count: 0,
	data: [],
};

const initialState: DailyReportState = {
	orderReturns: subInitialState,
	orders: subInitialState,
	transactionReturns: subInitialState,
	transactions: subInitialState,
};

export const dailyReport = createSlice({
	name: "daily-report",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addMatcher(
			dailyReportApi.endpoints.getDailyReport.matchFulfilled,
			(_, action) => action.payload
		);
	},
});

export const dailyReportReducer = dailyReport.reducer;
