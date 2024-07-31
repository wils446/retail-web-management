import { createSlice } from "@reduxjs/toolkit";
import { GetHistoryResponse, historyApi } from "..";

const initialState: GetHistoryResponse = {
	count: 0,
	histories: [],
};

export const history = createSlice({
	name: "history",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addMatcher(
			historyApi.endpoints.getHistory.matchFulfilled,
			(_, action) => action.payload
		);
	},
});

export const historyReducer = history.reducer;
