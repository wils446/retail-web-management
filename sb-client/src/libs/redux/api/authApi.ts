import { api } from ".";

type ILoginQuery = {
	username: string;
	password: string;
};

type ILoginResponse = {
	access_token: string;
};

export const authApi = api.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation<ILoginResponse, ILoginQuery>({
			query: ({ password, username }) => ({
				url: "/auth/login",
				body: { username, password },
				method: "POST",
			}),
		}),
	}),
});

export const { useLoginMutation } = authApi;
