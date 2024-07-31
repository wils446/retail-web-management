import { useAppSelector, usePromiseToast } from "@libs/hooks";
import { useUpdateCartMutation } from "@libs/redux";
import { convertRupiah } from "@libs/utils";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export const useCartDetailSelector = () => {
	const router = useRouter();
	const params = useParams();
	const { endLoading, startLoading } = usePromiseToast();
	const [updateCartFn, { isLoading: isUpdateCartLoading }] =
		useUpdateCartMutation();
	const carts = useAppSelector((state) => state.cartReducer);
	const cart = carts.find((cart) => cart.id === params.cartId);

	const [isEditCartName, setIsEditCartName] = useState(false);
	const [isAddCartItem, setIsAddCartItem] = useState(false);
	const [cartNameValue, setCartNameValue] = useState("");
	const [editCartItemId, setEditCartItemId] = useState("");
	const [deleteCartId, setDeleteCartId] = useState("");

	const cartItems = useMemo(
		() =>
			cart?.cartItems.map((item) => ({
				Nama: item.name,
				Qty: item.quantity,
				Harga: convertRupiah(item.price),
				id: item.id,
			})),
		[cart]
	);

	const updateCartName = async () => {
		if (!cart) return;
		startLoading();
		const response = await updateCartFn({ id: cart.id, name: cartNameValue });
		endLoading(response, "Keranjang berhasil di ubah");
		setIsEditCartName(false);
	};

	useEffect(() => {
		if (!cart) router.push("/app/cart");
		if (cart?.name) setCartNameValue(cart.name);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return {
		cart,
		isEditCartName,
		cartNameValue,
		setCartNameValue,
		updateCartName,
		setIsEditCartName,
		cartItems,
		setEditCartItemId,
		router,
		isAddCartItem,
		setIsAddCartItem,
		editCartItemId,
		deleteCartId,
		setDeleteCartId,
		isUpdateCartLoading,
	};
};
