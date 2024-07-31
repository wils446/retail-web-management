import { createSlice } from "@reduxjs/toolkit";
import { getCookie } from "cookies-next";
import { authApi } from "../api";

const tokenKey = "access_token";

const initialState: string | null = getCookie(tokenKey) || null;

export const token = createSlice({
	name: "token",
	initialState,
	reducers: {
		resetToken: () => null,
	},
	extraReducers: (builder) => {
		builder.addMatcher(
			authApi.endpoints.login.matchFulfilled,
			(_, action) => action.payload.access_token
		);
	},
});

export const tokenReducer = token.reducer;
export const { resetToken } = token.actions;
