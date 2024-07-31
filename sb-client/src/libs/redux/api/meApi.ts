import { api } from ".";

export type UserResponse = {
	id: string;
	username: string;
	role: "admin" | "none";
};

type UpdatePasswordMutation = {
	newPassword: string;
	oldPassword: string;
};

export const meApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getMe: builder.query<UserResponse, void>({ query: () => "/me" }),
		updatePassword: builder.mutation<void, UpdatePasswordMutation>({
			query: ({ newPassword, oldPassword }) => ({
				url: "/me",
				method: "PATCH",
				body: { newPassword, oldPassword },
			}),
		}),
	}),
});

export const { useGetMeQuery, useUpdatePasswordMutation, useLazyGetMeQuery } =
	meApi;
