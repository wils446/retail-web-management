import { usePromiseToast } from "@libs/hooks";
import { TransactionResponse, useLazyGetTransactionByIdQuery } from "@libs/redux";
import { useCreateReturnMutation } from "@libs/redux/api/returnApi";
import { addHoursToLocalTime, convertRupiah } from "@libs/utils";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ReturnItemProps } from "./useAddReturnItemSelector";

export const useTransactionReturnSelector = () => {
	const router = useRouter();
	const params = useParams<{ transactionId: string }>();
	const [getTransactionById] = useLazyGetTransactionByIdQuery();
	const { endLoading, startLoading } = usePromiseToast();
	const [createReturnFn, { isLoading: isCreateReturnLoading }] = useCreateReturnMutation();

	const [transaction, setTransaction] = useState<TransactionResponse>();
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
				isSellable: item.isSellable,
			})),
			targetId: params.transactionId,
			type: "transaction",
		});
		endLoading(response, "Berhasil menambahkan retur");
		router.push(`/app/transaction/${params.transactionId}`);
	}, [params.transactionId, returnItems]); // eslint-disable-line react-hooks/exhaustive-deps

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

	const transactionDate = useMemo(
		() => addHoursToLocalTime(transaction?.created_at || "", 0).toLocaleDateString(),
		[transaction]
	);

	const returableItems = useMemo(
		() =>
			transaction?.items.map((item) => ({
				id: item.item.id,
				name: item.name,
				quantity: item.quantity,
			})) || [],
		[transaction]
	);

	const fetchTransaction = useCallback(() => {
		getTransactionById({ id: params.transactionId })
			.then((res) => setTransaction(res.data))
			.catch(() => router.back());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.transactionId]);

	useEffect(fetchTransaction, [fetchTransaction]);

	return {
		router,
		transaction,
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
		transactionDate,
		returableItems,
	};
};
