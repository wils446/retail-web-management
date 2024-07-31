import { api } from ".";
import { CategoryResponse } from "./categoryApi";

export type ItemStock = {
	id: string;
	created_at: string;
	updated_at: string;
	stock: number;
	cost: number;
};

export type ItemResponse = {
	id: string;
	created_at: Date;
	updated_at: Date;
	name: string;
	price: number;
	category: CategoryResponse | null;
	stocks: ItemStock[];
};

type GetItemResponse = {
	count: number;
	items: ItemResponse[];
};

type CreateItemMutation = {
	name: string;
	price?: number;
	categoryId?: string;
};

type DeleteItemMutation = {
	id: string;
};

type UpdateItemMutation = {
	id: string;
	name?: string;
	quantity?: number;
	price?: number;
	categoryId?: string;
};

type DeleteItemResponse = {
	message: string;
};

export type GetItemsQuery = {
	queryString?: string;
};

export const itemApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getItems: builder.query<GetItemResponse, void | GetItemsQuery>({
			query: (query) => ({
				url: `/item${query ? (query.queryString ? `?${query.queryString}` : "") : ""}`,
			}),
		}),
		createItem: builder.mutation<ItemResponse, CreateItemMutation>({
			query: ({ name, price, categoryId }) => ({
				url: "/item",
				method: "POST",
				body: { name, price, categoryId },
			}),
		}),
		deleteItem: builder.mutation<DeleteItemResponse, DeleteItemMutation>({
			query: ({ id }) => ({
				url: `/item/${id}`,
				method: "DELETE",
			}),
		}),
		updateItem: builder.mutation<ItemResponse, UpdateItemMutation>({
			query: ({ categoryId, name, price, quantity, id }) => ({
				url: `/item/${id}`,
				method: "PATCH",
				body: { name, price, quantity, categoryId },
			}),
		}),
		getItemById: builder.query<ItemResponse, { id: string }>({
			query: (query) => `/item/${query.id}`,
		}),
	}),
});

export const {
	useCreateItemMutation,
	useDeleteItemMutation,
	useGetItemsQuery,
	useUpdateItemMutation,
	useLazyGetItemsQuery,
	useLazyGetItemByIdQuery,
} = itemApi;
