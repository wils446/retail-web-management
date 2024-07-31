import { useAppSelector, useItem, usePromiseToast } from "@libs/hooks";
import { useCreateCartMutation, useLazyGetCartsQuery } from "@libs/redux";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export const useCartSelector = () => {
	const router = useRouter();
	const { endLoading, startLoading } = usePromiseToast();
	const [getCarts] = useLazyGetCartsQuery();
	const { getItem } = useItem();
	const [createCartFn] = useCreateCartMutation();
	const carts = useAppSelector((state) => state.cartReducer);

	const [searchValue, setSearchValue] = useState("");

	const createCart = async () => {
		startLoading();
		const response = await createCartFn({});
		endLoading(response, "Keranjang berhasil ditambahkan");
		if ("data" in response) router.push(`/app/cart/${response.data.id}`);
	};

	const modifiedCarts = useMemo(() => {
		return carts.filter(
			(cart) =>
				cart.name.toLowerCase().startsWith(searchValue) && !cart.checkout
		);
	}, [carts, searchValue]);

	useEffect(() => {
		getItem();
		getCarts();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return {
		searchValue,
		setSearchValue,
		createCart,
		modifiedCarts,
		router,
	};
};
