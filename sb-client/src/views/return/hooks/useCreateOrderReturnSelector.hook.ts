import { useAppSelector, usePromiseToast, useQueryString } from "@libs/hooks";
import { useCreateReturnMutation } from "@libs/redux/api/returnApi";
import { addHoursToLocalTime, convertRupiah } from "@libs/utils";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ReturnItemProps } from "./useAddReturnItemSelector";
import { OrderResponse, useLazyGetOrderByIdQuery } from "@libs/redux";

export const useCreateOrderReturnSelector = () => {
	const router = useRouter();
	const params = useParams<{ orderId: string }>();
	const [getOrderById] = useLazyGetOrderByIdQuery();

	const { endLoading, startLoading } = usePromiseToast();
	const [createReturnFn, { isLoading: isCreateReturnLoading }] = useCreateReturnMutation();

	const [order, setOrder] = useState<OrderResponse>();
	const [isAddReturnItem, setIsAddReturnItem] = useState(false);
	const [editReturnItemId, setEditReturnItemId] = useState("");
	const [returnItems, setReturnItems] = useState<ReturnItemProps[]>([]);

	const addReturnItem = useCallback(
		(item: ReturnItemProps) => setReturnItems((prev) => [...prev, item]),
		[]
	);
	const editReturnItem = useCallback((item: ReturnItemProps) => {
		setReturnItems((prev) => [...prev.filter((returnItem) => returnItem.id !== item.id), item]);
	}, []);
	const deleteReturnItem = useCallback(
		(itemId: string) =>
			setReturnItems((prev) => prev.filter((returnItem) => returnItem.id !== itemId)),
		[]
	);

	const openAddReturnItemModal = useCallback(() => setIsAddReturnItem(true), []);
	const closeAddReturnItemModal = useCallback(() => setIsAddReturnItem(false), []);

	const onEditButtonClick = useCallback((id: string) => setEditReturnItemId(id), []);
	const onCloseEditButtonClick = useCallback(() => setEditReturnItemId(""), []);

	const onSubmitButtonClick = useCallback(async () => {
		startLoading();
		const response = await createReturnFn({
			items: returnItems.map((item) => ({
				itemId: item.id,
				quantity: item.quantity,
				returnPrice: item.returnPrice,
				isSellable: false,
			})),
			targetId: params.orderId,
			type: "order",
		});
		endLoading(response, "Berhasil menambahkan retur");
		router.back();
	}, [params.orderId, returnItems]); // eslint-disable-line react-hooks/exhaustive-deps

	const modifiedReturnItems = useMemo(
		() =>
			returnItems.map((item) => ({
				id: item.id,
				nama: item.name,
				qty: item.quantity,
				harga: convertRupiah(item.returnPrice),
			})),
		[returnItems]
	);

	const orderDate = useMemo(
		() => addHoursToLocalTime(order?.created_at || "", 0).toLocaleDateString(),
		[order]
	);

	const returableItems = useMemo(
		() =>
			order?.items.map((item) => ({
				id: item.item.id,
				name: item.name,
				quantity: item.quantity,
			})) || [],
		[order]
	);

	const fetchOrder = useCallback(() => {
		getOrderById({ id: params.orderId })
			.then((res) => setOrder(res.data))
			.catch(() => router.back());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.orderId]);

	useEffect(fetchOrder, [fetchOrder]);

	return {
		router,
		order,
		returnItems,
		addReturnItem,
		isAddReturnItem,
		openAddReturnItemModal,
		closeAddReturnItemModal,
		modifiedReturnItems,
		onEditButtonClick,
		onCloseEditButtonClick,
		editReturnItemId,
		editReturnItem,
		deleteReturnItem,
		onSubmitButtonClick,
		isCreateReturnLoading,
		orderDate,
		returableItems,
	};
};
