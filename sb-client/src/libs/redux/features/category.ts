import { createSlice } from "@reduxjs/toolkit";
import { categoryApi } from "../api";

export type CategoryState = {
	id: string;
	name: string;
};

const initialState: CategoryState[] = [];

export const category = createSlice({
	name: "category",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addMatcher(
			categoryApi.endpoints.getCategories.matchFulfilled,
			(_, action) =>
				action.payload.categories.map(({ id, name }) => ({ id, name }))
		);

		builder.addMatcher(
			categoryApi.endpoints.updateCategory.matchFulfilled,
			(state, action) =>
				state.map((state) =>
					state.id === action.payload.id ? action.payload : state
				)
		);

		builder.addMatcher(
			categoryApi.endpoints.createCategory.matchFulfilled,
			(state, action) => [action.payload, ...state]
		);

		builder.addMatcher(
			categoryApi.endpoints.deleteCategory.matchFulfilled,
			(state, action) =>
				state.filter(
					(state) => state.id !== action.payload.message.split(" ")[0]
				)
		);
	},
});

export const categoryReducer = category.reducer;
