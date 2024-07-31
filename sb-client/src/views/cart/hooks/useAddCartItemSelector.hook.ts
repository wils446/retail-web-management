import { useAppSelector, usePromiseToast, useQueryString } from "@libs/hooks";
import {
	CartResponse,
	ItemResponse,
	useAddItemToCartMutation,
	useLazyGetItemsQuery,
} from "@libs/redux";
import { useDebounce } from "@uidotdev/usehooks";
import { useCallback, useEffect, useMemo, useState } from "react";

type AddCartItemState = {
	itemName: string;
	quantity: number;
	price: number;
};

export const useAddCartItemSelector = (cart: CartResponse, closeModalFn: () => void) => {
	const items = useAppSelector((state) => state.itemReducer);
	const [getItems] = useLazyGetItemsQuery();
	const [addItemToCartFn, { isLoading: isAddItemToCartLoading }] = useAddItemToCartMutation();
	const { startLoading, endLoading } = usePromiseToast();
	const { createQueryString } = useQueryString();

	const [isEditPrice, setIsEditPrice] = useState(false);
	const [itemList, setItemList] = useState<ItemResponse[]>([]);
	const [cartItemValue, setCartItemValue] = useState<AddCartItemState>({
		itemName: "",
		price: 0,
		quantity: 1,
	});
	const debouncedItemName = useDebounce(cartItemValue.itemName, 300);

	const item = useMemo(
		() => itemList.find((item) => item.name === cartItemValue.itemName) || null,
		[cartItemValue.itemName] // eslint-disable-line react-hooks/exhaustive-deps
	);

	const itemStock = useMemo(
		() => item?.stocks.reduce((prev, curr) => prev + curr.stock, 0) || 0,
		[item]
	);
	const updateItemName = useCallback(
		(value: string) => {
			setCartItemValue({ ...cartItemValue, itemName: value });
		},
		[cartItemValue]
	);

	const updatePrice = useCallback(
		(value: number) => {
			setCartItemValue({ ...cartItemValue, price: value });
		},
		[cartItemValue]
	);

	const updateQuantity = useCallback(
		(value: number) => {
			if (value > itemStock) value = itemStock;
			if (value < 1) value = 1;

			setCartItemValue({ ...cartItemValue, quantity: value });
		},
		[cartItemValue, itemStock]
	);

	const clearCartItemValue = () =>
		setCartItemValue({
			itemName: "",
			price: 0,
			quantity: 1,
		});

	const closeModal = () => {
		if (isAddItemToCartLoading) return;
		clearCartItemValue();
		setIsEditPrice(false);
		closeModalFn();
	};

	const addItemToCart = useCallback(async () => {
		if (!item) return;
		startLoading();
		const response = await addItemToCartFn({
			cartId: cart.id,
			itemId: item.id,
			quantity: cartItemValue.quantity,
			price:
				cartItemValue.price === item.price * cartItemValue.quantity
					? undefined
					: cartItemValue.price,
		});
		endLoading(response, "Barang berhasil ditambah ke keranjang");
		closeModal();
	}, [cart.id, item?.id, cartItemValue, closeModal]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!item || !itemStock) {
			updatePrice(0);
			return;
		}

		updatePrice(cartItemValue.quantity * item.price);
	}, [itemStock, item, cartItemValue.itemName, cartItemValue.quantity]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		getItems({ queryString: createQueryString("name", debouncedItemName) }).then((res) =>
			setItemList(res.data?.items || [])
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedItemName]);

	return {
		cartItemValue,
		updateItemName,
		updatePrice,
		updateQuantity,
		item,
		itemStock,
		itemList,
		addItemToCart,
		closeModal,
		isAddItemToCartLoading,
		isEditPrice,
		setIsEditPrice,
	};
};
