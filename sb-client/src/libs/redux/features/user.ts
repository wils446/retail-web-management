import { createSlice } from "@reduxjs/toolkit";
import { meApi } from "../api";

export type IUserState = {
	username: string | null;
	role: "admin" | "none" | null;
	id: string | null;
};

const initialState: IUserState = {
	id: null,
	username: null,
	role: null,
};

export const user = createSlice({
	name: "user",
	initialState,
	reducers: {
		clearUser: () => initialState,
	},
	extraReducers: (builder) => {
		builder.addMatcher(
			meApi.endpoints.getMe.matchFulfilled,
			(_, action) => action.payload
		);
	},
});

export const userReducer = user.reducer;
export const { clearUser } = user.actions;
