import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import {
	cartReducer,
	categoryReducer,
	dailyReportReducer,
	historyReducer,
	itemReducer,
	orderReducer,
	returnReducer,
	tokenReducer,
	transactionReducer,
	userReducer,
	usersReducer,
} from "./features";

export const createStore = () =>
	configureStore({
		reducer: {
			tokenReducer,
			userReducer,
			itemReducer,
			categoryReducer,
			cartReducer,
			transactionReducer,
			orderReducer,
			historyReducer,
			usersReducer,
			returnReducer,
			dailyReportReducer,
			[api.reducerPath]: api.reducer,
		},
		middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
	});

export const store = configureStore({
	reducer: {
		tokenReducer,
		userReducer,
		itemReducer,
		categoryReducer,
		cartReducer,
		transactionReducer,
		orderReducer,
		historyReducer,
		usersReducer,
		returnReducer,
		dailyReportReducer,
		[api.reducerPath]: api.reducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
