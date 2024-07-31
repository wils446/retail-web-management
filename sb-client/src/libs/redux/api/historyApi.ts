import { api } from ".";

export type HistoryResponse = {
	text: string;
	type: string;
	detail: string | null;
	id: string;
	created_at: string;
	updated_at: string;
};

export type GetHistoryResponse = {
	count: number;
	histories: HistoryResponse[];
};

export type GetHistoryQuery = {
	queryString?: string;
};

export const historyApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getHistory: builder.query<GetHistoryResponse, void | GetHistoryQuery>({
			query: (query) =>
				`/history${query ? (query.queryString ? `?${query.queryString}` : "") : ""}`,
		}),
	}),
});

export const { useGetHistoryQuery, useLazyGetHistoryQuery } = historyApi;
