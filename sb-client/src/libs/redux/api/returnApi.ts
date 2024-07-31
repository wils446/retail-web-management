import { api } from "./api";
import { ItemResponse } from "./itemApi";

export type ReturnItemResponse = {
	id: string;
	created_at: string;
	updated_at: string;
	name: string;
	quantity: number;
	returnPrice: number;
	item: Omit<ItemResponse, "category" | "stocks">;
};

export type ReturnResponse = {
	id: string;
	created_at: string;
	updated_at: string;
	name: string;
	type: "order" | "transaction";
	targetId: string;
	invoiceNumber: string;
	returnItem: ReturnItemResponse[];
};

export type GetReturnsResponse = {
	returns: ReturnResponse[];
	count: number;
};

export type CreateReturnItem = {
	itemId: string;
	returnPrice: number;
	quantity: number;
	isSellable?: boolean;
};

export type CreateReturnMutation = {
	targetId: string;
	type: "order" | "transaction";
	items: CreateReturnItem[];
};

export type GetReturnsQuery = {
	queryString?: string;
};

export const returnApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getReturns: builder.query<GetReturnsResponse, void | GetReturnsQuery>({
			query: (query) => ({
				url: `/return${query ? (query.queryString ? `?${query.queryString}` : "") : ""}`,
			}),
		}),
		createReturn: builder.mutation<ReturnResponse, CreateReturnMutation>({
			query: ({ items, targetId, type }) => ({
				url: "/return",
				method: "POST",
				body: { items, type, targetId },
			}),
		}),
		getReturnById: builder.query<ReturnResponse, { id: string }>({
			query: (query) => `/return/${query.id}`,
		}),
	}),
});

export const {
	useCreateReturnMutation,
	useLazyGetReturnByIdQuery,
	useGetReturnsQuery,
	useLazyGetReturnsQuery,
} = returnApi;
