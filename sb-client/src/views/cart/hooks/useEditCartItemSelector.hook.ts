import { useAppSelector, usePromiseToast } from "@libs/hooks";
import {
	CartResponse,
	useDeleteItemFromCartMutation,
	useUpdateCartItemMutation,
} from "@libs/redux";
import { useCallback, useEffect, useMemo, useState } from "react";

type EditCartItemState = {
	quantity: number;
	price: number;
};

export const useEditCartItemSelector = (
	cart: CartResponse,
	cartItemId: string,
	closeModalFn: () => void
) => {
	const items = useAppSelector((state) => state.itemReducer);
	const { startLoading, endLoading } = usePromiseToast();
	const [deleteItemFromCartFn, { isLoading: isDeleteItemFromCartLoading }] =
		useDeleteItemFromCartMutation();
	const [updateCartItemFn, { isLoading: isUpdateCartItemLoading }] =
		useUpdateCartItemMutation();

	const [isEditPrice, setIsEditPrice] = useState(false);
	const [showInitialPrice, setShowInitialPrice] = useState(true);
	const [cartItemValue, setCartItemValue] = useState<EditCartItemState>({
		quantity: 1,
		price: 0,
	});

	const cartItem = useMemo(
		() => cart.cartItems.find((cartItem) => cartItem.id === cartItemId),
		[cartItemId, cart]
	);

	const item = useMemo(
		() => items.find((item) => item.id === cartItem?.item?.id),
		[cartItem, items]
	);

	const itemStock = useMemo(
		() => item?.stocks.reduce((prev, curr) => prev + curr.stock, 0) || 0,
		[item]
	);

	const updateQuantity = useCallback(
		(value: number) => {
			if (value > itemStock) value = itemStock;
			if (value < 1) value = 1;

			setCartItemValue({ ...cartItemValue, quantity: value });
		},
		[cartItemValue, itemStock]
	);

	const updatePrice = useCallback(
		(value: number) => setCartItemValue({ ...cartItemValue, price: value }),
		[cartItemValue]
	);

	const clearState = () => {
		setIsEditPrice(false);
		setCartItemValue({ quantity: 1, price: 0 });
		setShowInitialPrice(true);
	};

	const closeModal = useCallback(() => {
		if (isDeleteItemFromCartLoading || isUpdateCartItemLoading) return;
		closeModalFn();
		clearState();
	}, [isDeleteItemFromCartLoading, isUpdateCartItemLoading]); // eslint-disable-line react-hooks/exhaustive-deps

	const updateCartItem = useCallback(async () => {
		if (!item) return;
		const { price, quantity } = cartItemValue;
		startLoading();
		const response = await updateCartItemFn({
			cartId: cart.id,
			itemId: cartItemId,
			quantity,
			price: price === item.price * quantity ? undefined : price,
		});
		endLoading(response, "Berhasil melakukan perubahan");
		closeModal();
	}, [cart, cartItemId, cartItemValue.quantity, cartItemValue.price]); // eslint-disable-line react-hooks/exhaustive-deps

	const deleteItemFromCart = useCallback(async () => {
		startLoading();
		const response = await deleteItemFromCartFn({
			cartId: cart.id,
			cartItemId: cartItemId,
		});
		endLoading(response, "item berhasil dihapus");
		closeModal();
	}, [cart, cartItemId]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!cartItem || !showInitialPrice) return;
		setCartItemValue({
			quantity: cartItem.quantity,
			price: cartItem.price,
		});
	}, [cartItemId, cartItem]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!item || !itemStock || !cartItem) return;

		if (showInitialPrice) setShowInitialPrice(false);
		else updatePrice(cartItemValue.quantity * item.price);
	}, [cartItemValue.quantity]); // eslint-disable-line react-hooks/exhaustive-deps

	return {
		cartItem,
		closeModal,
		cartItemValue,
		updateQuantity,
		updatePrice,
		isEditPrice,
		item,
		itemStock,
		updateCartItem,
		deleteItemFromCart,
		isDeleteItemFromCartLoading,
		isUpdateCartItemLoading,
		setIsEditPrice,
	};
};
