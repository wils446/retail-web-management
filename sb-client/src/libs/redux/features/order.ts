import { createSlice } from "@reduxjs/toolkit";
import { GetOrdersResponse, orderApi } from "../api/orderApi";

const initialState: GetOrdersResponse = {
	count: 0,
	orders: [],
};

export const order = createSlice({
	name: "order",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addMatcher(orderApi.endpoints.getOrders.matchFulfilled, (_, action) => action.payload);

		builder.addMatcher(orderApi.endpoints.createOrder.matchFulfilled, (state, action) => ({
			...state,
			orders: [action.payload, ...state.orders],
		}));

		builder.addMatcher(orderApi.endpoints.updateOrder.matchFulfilled, (state, action) => ({
			...state,
			orders: state.orders.map((order) =>
				order.id === action.payload.id ? action.payload : order
			),
		}));
	},
});

export const orderReducer = order.reducer;
