import { createSlice } from "@reduxjs/toolkit";
import { UserResponse, userApi } from "..";

type UsersState = UserResponse[];

const initialState: UsersState = [];

export const users = createSlice({
	name: "users",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addMatcher(
			userApi.endpoints.getUsers.matchFulfilled,
			(_, action) => action.payload.users
		);
		builder.addMatcher(
			userApi.endpoints.updateUser.matchFulfilled,
			(state, action) => {
				if (!state.length) return [];
				return state.map((state) => {
					if (state.id === action.payload.id) return action.payload;

					return state;
				});
			}
		);
		builder.addMatcher(
			userApi.endpoints.deleteUser.matchFulfilled,
			(state, action) =>
				state.filter((user) => {
					const userId = action.payload.message.split(" ")[0];

					return user.id !== userId;
				})
		);
	},
});

export const usersReducer = users.reducer;
