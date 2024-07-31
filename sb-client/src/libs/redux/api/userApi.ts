import { UserResponse, api } from ".";

type UpdateUserMutation = {
	id: string;
	username?: string;
	password?: string;
	adminPassword: string;
};

type GetUsersResponse = {
	count: number;
	users: UserResponse[];
};

type DeleteUserMutation = {
	userId: string;
	adminPassword: string;
};

type DeleteUserResponse = {
	message: string;
};

export const userApi = api.injectEndpoints({
	endpoints: (builder) => ({
		updateUser: builder.mutation<UserResponse, UpdateUserMutation>({
			query: ({ id, username, password, adminPassword }) => ({
				url: `/user/${id}`,
				method: "PATCH",
				body: { username, password, adminPassword },
			}),
		}),
		getUsers: builder.query<GetUsersResponse, void>({
			query: () => "/user",
		}),
		deleteUser: builder.mutation<DeleteUserResponse, DeleteUserMutation>({
			query: ({ userId, adminPassword }) => ({
				url: `/user/${userId}`,
				method: "DELETE",
				body: { adminPassword },
			}),
		}),
	}),
});

export const { useUpdateUserMutation, useLazyGetUsersQuery, useDeleteUserMutation } = userApi;
