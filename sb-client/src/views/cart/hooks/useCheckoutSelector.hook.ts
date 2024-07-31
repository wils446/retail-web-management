import { useAppSelector, usePromiseToast } from "@libs/hooks";
import { useCreateTransactionMutation } from "@libs/redux/api/transactionApi";
import { convertRupiah } from "@libs/utils";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type PaidStatus = "Belum Lunas" | "Lunas";

type CheckoutFormState = {
	name: string;
	paidStatus: PaidStatus;
	discount: number;
	address: string;
	city: string;
	province: string;
	postalCode: string;
	country: string;
};

const initialFormValue: CheckoutFormState = {
	name: "",
	paidStatus: "Belum Lunas",
	discount: 0,
	address: "",
	city: "",
	province: "",
	postalCode: "",
	country: "Indonesia",
};

export const useCheckoutSelector = () => {
	const router = useRouter();
	const params = useParams();
	const { endLoading, startLoading } = usePromiseToast();
	const [createTransactionFn, { isLoading: isCreateTransactionLoading }] =
		useCreateTransactionMutation();
	const carts = useAppSelector((state) => state.cartReducer);
	const cart = carts.find((cart) => cart.id === params.cartId);

	const [formValue, setFormValue] = useState<CheckoutFormState>(initialFormValue);

	const updateForm = useCallback(
		function <T extends keyof CheckoutFormState>(key: T, value: CheckoutFormState[T]) {
			setFormValue({ ...formValue, [key]: value });
		},
		[formValue]
	);

	const cartItems = useMemo(
		() =>
			cart?.cartItems.map((cartItem) => ({
				Nama: cartItem.name,
				Qty: cartItem.quantity,
				Harga: convertRupiah(cartItem.price),
			})) || [],
		[cart]
	);

	const price = useMemo(
		() => cart?.cartItems.reduce((prev, curr) => prev + curr.price, 0) || 0,
		[cart]
	);

	const discountPrice = useMemo(
		() => (price * formValue.discount) / 100,
		[formValue.discount, price]
	);

	const totalPrice = useMemo(() => price - discountPrice, [discountPrice, price]);

	const submitTransaction = useCallback(
		async () => {
			if (!cart) return;
			startLoading();
			const response = await createTransactionFn({
				cartId: cart.id,
				name: formValue.name,
				discount: formValue.discount,
				address: formValue.address,
				city: formValue.city,
				country: formValue.country,
				postalCode: formValue.postalCode,
				province: formValue.province,
				paid: formValue.paidStatus === "Lunas",
				totalPrice,
			});
			endLoading(response, "Transaksi berhasil");
			router.push("/app/transaction");
		},
		[cart, formValue, createTransactionFn] // eslint-disable-line react-hooks/exhaustive-deps
	);

	useEffect(() => {
		if (formValue.discount <= 100) return;
		updateForm("discount", 100);
	}, [formValue.discount]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!cart) return;
		updateForm("name", cart.name);
	}, [cart]); // eslint-disable-line react-hooks/exhaustive-deps

	return {
		formValue,
		cartItems,
		discountPrice,
		submitTransaction,
		isCreateTransactionLoading,
		router,
		updateForm,
		price,
		totalPrice,
	};
};
