import { createSlice } from "@reduxjs/toolkit";
import { GetReturnsResponse, returnApi } from "../api/returnApi";

const initialState: GetReturnsResponse = {
	count: 0,
	returns: [],
};

export const retur = createSlice({
	name: "return",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addMatcher(
			returnApi.endpoints.getReturns.matchFulfilled,
			(_, action) => action.payload
		);

		builder.addMatcher(returnApi.endpoints.createReturn.matchFulfilled, (state, action) => ({
			...state,
			returns: [action.payload, ...state.returns],
		}));
	},
});

export const returnReducer = retur.reducer;
