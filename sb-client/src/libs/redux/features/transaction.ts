import { createSlice } from "@reduxjs/toolkit";
import { GetTransactionResponse, transactionApi } from "../api/transactionApi";

const initialState: GetTransactionResponse = {
	count: 0,
	transactions: [],
};

export const transaction = createSlice({
	name: "transaction",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addMatcher(
			transactionApi.endpoints.createTransaction.matchFulfilled,
			(state, action) => ({
				...state,
				transactions: [action.payload, ...state.transactions],
			})
		);
		builder.addMatcher(
			transactionApi.endpoints.getTransactions.matchFulfilled,
			(_, action) => action.payload
		);
		builder.addMatcher(
			transactionApi.endpoints.updateTransaction.matchFulfilled,
			(state, action) => ({
				...state,
				transactions: state.transactions.map((transaction) => {
					if (transaction.id !== action.payload.id) return transaction;

					return { ...transaction, ...action.payload };
				}),
			})
		);
	},
});

export const transactionReducer = transaction.reducer;
