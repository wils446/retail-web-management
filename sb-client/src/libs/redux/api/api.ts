import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "..";

const baseQuery = fetchBaseQuery({
	baseUrl: process.env.NEXT_PUBLIC_API_URL as string,
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).tokenReducer;

		if (token) headers.set("authorization", `Bearer ${token}`);

		return headers;
	},
});

export const api = createApi({
	reducerPath: "api",
	baseQuery,
	endpoints: () => ({}),
});
