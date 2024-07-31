import { createSlice } from "@reduxjs/toolkit";
import { CartResponse, cartApi } from "..";

type CartState = CartResponse;

const initialState: CartState[] = [];

export const cart = createSlice({
	name: "cart",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addMatcher(cartApi.endpoints.getCarts.matchFulfilled, (_, action) =>
			action.payload.carts.reverse()
		);
		builder.addMatcher(
			cartApi.endpoints.createCart.matchFulfilled,
			(state, action) => [{ ...action.payload, cartItems: [] }, ...state]
		);
		builder.addMatcher(
			cartApi.endpoints.deleteCart.matchFulfilled,
			(state, action) =>
				state.filter(
					(state) => state.id !== action.payload.message.split(" ")[0]
				)
		);
		builder.addMatcher(
			cartApi.endpoints.updateCart.matchFulfilled,
			(state, action) =>
				state.map((state) =>
					state.id === action.payload.id ? action.payload : state
				)
		);
		builder.addMatcher(
			cartApi.endpoints.addItemToCart.matchFulfilled,
			(state, action) =>
				state.map((state) => {
					if (state.id !== action.payload.cartId) return state;

					const cartItems = [...state.cartItems];
					const cartItemIndex = cartItems.findIndex(
						(cartItem) => cartItem.id === action.payload.cartItem.id
					);
					if (cartItemIndex === -1) cartItems.push(action.payload.cartItem);
					else cartItems[cartItemIndex] = action.payload.cartItem;

					return {
						...state,
						cartItems,
					};
				})
		);
		builder.addMatcher(
			cartApi.endpoints.updateCartItem.matchFulfilled,
			(state, action) => {
				return state.map((state) => {
					if (state.id !== action.payload.cartId) return state;

					const cartItems = [...state.cartItems].map((cartItem) =>
						cartItem.id === action.payload.cartItem.id
							? action.payload.cartItem
							: cartItem
					);

					return {
						...state,
						cartItems,
					};
				});
			}
		);
		builder.addMatcher(
			cartApi.endpoints.deleteItemFromCart.matchFulfilled,
			(state, action) => {
				const splittedMessage = action.payload.message.split(" ");
				const cartItemid = splittedMessage[0];
				const cartId = splittedMessage[3];

				return state.map((cart) => {
					return {
						...cart,
						cartItems:
							cartId !== cart.id
								? cart.cartItems
								: cart.cartItems.filter((item) => item.id !== cartItemid),
					};
				});
			}
		);
	},
});

export const cartReducer = cart.reducer;
