import { ItemResponse, ReturnResponse, UserResponse, api } from ".";

export type OrderItemResponse = {
	id: string;
	quantity: number;
	item: ItemResponse;
	cost: number;
	name: string;
};

export type OrderResponse = {
	id: string;
	name: string;
	paid: boolean;
	status: number;
	created_at: string;
	updated_at: string;
	items: OrderItemResponse[];
	invoiceNumber: string;
	createdBy: string;
	orderedBy: UserResponse;
	return: ReturnResponse | null;
};

export type GetOrdersResponse = {
	count: number;
	orders: OrderResponse[];
};

export type OrderItem = {
	itemId: string;
	quantity: number;
	cost: number;
};

export type CreateOrderMutation = {
	name: string;
	paid: boolean;
	items: OrderItem[];
};

export type UpdateOrderMutation = {
	id: string;
	paid: boolean;
};

export type GetOrdersQuery = {
	queryString?: string;
};

export const orderApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getOrders: builder.query<GetOrdersResponse, void | GetOrdersQuery>({
			query: (query) => ({
				url: `/order${query ? (query.queryString ? `?${query.queryString}` : "") : ""}`,
			}),
		}),
		createOrder: builder.mutation<OrderResponse, CreateOrderMutation>({
			query: ({ items, name, paid }) => ({
				url: "/order",
				method: "POST",
				body: { items, name, paid },
			}),
		}),
		updateOrder: builder.mutation<OrderResponse, UpdateOrderMutation>({
			query: ({ id, paid }) => ({
				url: `/order/${id}`,
				body: { paid },
				method: "PATCH",
			}),
		}),
		getOrderById: builder.query<OrderResponse, { id: string }>({
			query: (query) => `/order/${query.id}`,
		}),
	}),
});

export const {
	useCreateOrderMutation,
	useGetOrdersQuery,
	useLazyGetOrdersQuery,
	useUpdateOrderMutation,
	useLazyGetOrderByIdQuery,
} = orderApi;
