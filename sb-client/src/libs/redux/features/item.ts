import { createSlice } from "@reduxjs/toolkit";
import { CategoryState } from ".";
import { ItemStock, categoryApi, itemApi } from "../api";

export type Item = {
	id: string;
	name: string;
	price: number;
	category: null | CategoryState;
	stocks: ItemStock[];
};

export type ItemState = {
	count: number;
	items: Item[];
};

const initialState: ItemState = {
	count: 0,
	items: [],
};

export const item = createSlice({
	name: "token",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addMatcher(itemApi.endpoints.getItems.matchFulfilled, (_, action) => ({
			count: action.payload.count,
			items: action.payload.items.map(({ created_at, updated_at, ...data }) => ({
				...data,
			})),
		}));

		builder.addMatcher(itemApi.endpoints.deleteItem.matchFulfilled, (state, action) => ({
			count: state.count - 1,
			items: state.items.filter((state) => state.id !== action.payload.message.split(" ")[0]),
		}));

		builder.addMatcher(itemApi.endpoints.updateItem.matchFulfilled, (state, action) => ({
			...state,
			items: state.items.map((state) => {
				if (state.id === action.payload.id) return { ...state, ...action.payload };
				return state;
			}),
		}));

		builder.addMatcher(itemApi.endpoints.createItem.matchFulfilled, (state, action) => {
			const { created_at, updated_at, ...newItem } = action.payload;

			return {
				count: state.count + 1,
				items: [newItem, ...state.items],
			};
		});

		builder.addMatcher(categoryApi.endpoints.updateCategory.matchFulfilled, (state, action) => ({
			...state,
			items: state.items.map((item) => {
				if (item.category?.id === action.payload.id) {
					return {
						...item,
						category: {
							...item.category,
							name: action.payload.name,
						},
					};
				}

				return item;
			}),
		}));

		builder.addMatcher(categoryApi.endpoints.deleteCategory.matchFulfilled, (state, action) => ({
			...state,
			items: state.items.map((item) => {
				const categoryId = action.payload.message.split(" ")[0];

				if (item.category === null) return item;
				if (item.category.id === categoryId) {
					return {
						...item,
						category: null,
					};
				}

				return item;
			}),
		}));
	},
});

export const itemReducer = item.reducer;
