import { ItemResponse, api } from ".";

export type GetCartsResponse = {
	count: number;
	carts: CartResponse[];
};

export type CartResponse = {
	id: string;
	created_at: string;
	updated_at: string;
	name: string;
	totalPrice: number;
	checkout: boolean;
	cartItems: CartItem[];
};

export type CartItem = {
	id: string;
	created_at: string;
	updated_at: string;
	quantity: number;
	price: number;
	name: string;
	item: Omit<ItemResponse, "category"> | null;
};

export type CartItemResponse = {
	cartId: string;
	cartItem: CartItem;
};

export type DeleteResponse = { message: string };
export type CreateCartMutation = {
	name?: string;
	itemId?: string;
};
export type UpdateCartMutation = Pick<CartResponse, "id" | "name">;
export type DeleteCartMutation = Pick<CartResponse, "id">;
export type AddItemToCartMutation = {
	cartId: string;
	itemId: string;
	quantity: number;
	price?: number;
};
export type UpdateCartItemMutation = {
	cartId: string;
	itemId: string;
	quantity: number;
	price?: number;
};
export type DeleteCartItemMutation = {
	cartId: string;
	cartItemId: string;
};

export const cartApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getCarts: builder.query<GetCartsResponse, void>({
			query: () => "/cart",
		}),
		createCart: builder.mutation<CartResponse, CreateCartMutation>({
			query: ({ name, itemId }) => ({
				url: "/cart",
				method: "POST",
				body: { name, itemId },
			}),
		}),
		updateCart: builder.mutation<CartResponse, UpdateCartMutation>({
			query: ({ name, id }) => ({
				url: `/cart/${id}`,
				method: "PATCH",
				body: { name },
			}),
		}),
		deleteCart: builder.mutation<DeleteResponse, DeleteCartMutation>({
			query: ({ id }) => ({
				url: `/cart/${id}`,
				method: "DELETE",
			}),
		}),
		addItemToCart: builder.mutation<CartItemResponse, AddItemToCartMutation>({
			query: ({ cartId, itemId, quantity, price }) => ({
				url: `/cart/${cartId}/cart-item`,
				method: "POST",
				body: { itemId, quantity, price },
			}),
		}),
		updateCartItem: builder.mutation<CartItemResponse, UpdateCartItemMutation>({
			query: ({ quantity, cartId, itemId, price }) => ({
				url: `/cart/${cartId}/cart-item/${itemId}`,
				method: "PATCH",
				body: { quantity, price },
			}),
		}),
		deleteItemFromCart: builder.mutation<DeleteResponse, DeleteCartItemMutation>({
			query: ({ cartItemId, cartId }) => ({
				url: `/cart/${cartId}/cart-item/${cartItemId}`,
				method: "DELETE",
			}),
		}),
	}),
});

export const {
	useAddItemToCartMutation,
	useCreateCartMutation,
	useDeleteCartMutation,
	useDeleteItemFromCartMutation,
	useLazyGetCartsQuery,
	useUpdateCartItemMutation,
	useUpdateCartMutation,
	useGetCartsQuery,
} = cartApi;
