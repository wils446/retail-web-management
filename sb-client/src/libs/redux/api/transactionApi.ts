import { ItemResponse, ItemStock, ReturnResponse, UserResponse, api } from ".";

export type TransactionAddress = {
	id: string;
	created_at: string;
	updated_at: string;
	address: string | null;
	city: string | null;
	province: string | null;
	postalCode: string | null;
	country: string | null;
};

export type TransactionItem = {
	id: string;
	created_at: string;
	updated_at: string;
	name: string;
	quantity: number;
	price: number;
	stocks: ItemStock[];
	item: Omit<ItemResponse, "stocks" | "category">;
};

export type TransactionResponse = {
	name: string;
	paid: boolean;
	status: number;
	id: string;
	invoiceNumber: string;
	totalPrice: number;
	created_at: string;
	updated_at: string;
	createdBy: string;
	discount: number;
	checkoutUser: UserResponse;
	address: TransactionAddress;
	items: TransactionItem[];
	return: ReturnResponse;
};

export type GetTransactionResponse = {
	count: number;
	transactions: Omit<TransactionResponse, "return">[];
};

export type CreateTransactionMutation = {
	cartId: string;
	paid: boolean;
	name: string;
	discount: number;
	totalPrice: number;
	address?: string;
	city?: string;
	province?: string;
	postalCode?: string;
	country?: string;
};

export type UpdateTransactionMutation = {
	id: string;
	paid: boolean;
};

export type GetTransactionQuery = {
	queryString?: string;
};

export const transactionApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getTransactions: builder.query<GetTransactionResponse, void | GetTransactionQuery>({
			query: (query) => ({
				url: `/transaction${query ? (query.queryString ? `?${query.queryString}` : "") : ""}`,
			}),
		}),
		createTransaction: builder.mutation<TransactionResponse, CreateTransactionMutation>({
			query: (body) => ({
				url: "/transaction",
				method: "POST",
				body,
			}),
		}),
		updateTransaction: builder.mutation<TransactionResponse, UpdateTransactionMutation>({
			query: ({ paid, id }) => ({
				url: `/transaction/${id}`,
				method: "PATCH",
				body: { paid },
			}),
		}),
		getTransactionById: builder.query<TransactionResponse, { id: string }>({
			query: (query) => `/transaction/${query.id}`,
		}),
	}),
});

export const {
	useCreateTransactionMutation,
	useGetTransactionsQuery,
	useLazyGetTransactionsQuery,
	useUpdateTransactionMutation,
	useLazyGetTransactionByIdQuery,
} = transactionApi;
