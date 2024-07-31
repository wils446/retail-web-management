import { usePromiseToast } from "@libs/hooks";
import { ItemResponse, useLazyGetItemByIdQuery, useUpdateItemMutation } from "@libs/redux";
import { addHoursToLocalTime, convertRupiah } from "@libs/utils";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";

export const useItemDetailSelector = () => {
	const router = useRouter();
	const params = useParams<{ itemId: string }>();
	const [getItemById] = useLazyGetItemByIdQuery();

	const [item, setItem] = useState<ItemResponse>();

	const { endLoading, startLoading } = usePromiseToast();
	const [updateItemFn, { isLoading: isUpdateItemLoading }] = useUpdateItemMutation();

	const [isEditItemName, setIsEditItemName] = useState(false);
	const [isEditItemPrice, setIsEditItemPrice] = useState(false);
	const [isEditItemCategory, setIsEditItemCategory] = useState(false);
	const [itemNameValue, setItemNameValue] = useState("");
	const [itemPriceValue, setItemPriceValue] = useState(0);

	const toggleEditItemName = useCallback(() => setIsEditItemName((prev) => !prev), []);
	const toggleEditItemPrice = useCallback(() => setIsEditItemPrice((prev) => !prev), []);
	const toggleEditItemCategory = useCallback(() => setIsEditItemCategory((prev) => !prev), []);

	const editItemNameValue = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => setItemNameValue(e.target.value),
		[]
	);

	const editItemPriceValue = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => setItemPriceValue(+e.target.value),
		[]
	);

	const stock = useMemo(
		() => item?.stocks.reduce((prev, curr) => prev + curr.stock, 0) || 0,
		[item]
	);

	const stockTableData = useMemo(
		() =>
			item?.stocks.map((stock) => ({
				cost: convertRupiah(stock.cost),
				stock: stock.stock,
				date: addHoursToLocalTime(stock.created_at, 0).toLocaleDateString(),
			})) || [],
		[item]
	);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const goPrevPage = useCallback(() => router.back(), []);

	useEffect(() => {
		setItemNameValue(item?.name || "");
		setItemPriceValue(item?.price || 0);
	}, [item?.name, item?.price, isEditItemName]);

	const updateItem = useCallback(async () => {
		startLoading();
		const response = await updateItemFn({
			id: params.itemId,
			name: itemNameValue,
			price: itemPriceValue,
		});
		fetchItem();
		endLoading(response, "Edit berhasil");

		setIsEditItemName(false);
		setIsEditItemPrice(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [itemNameValue, itemPriceValue, params.itemId]);

	const fetchItem = useCallback(() => {
		getItemById({ id: params.itemId })
			.then((res) => setItem(res.data))
			.catch(() => goPrevPage());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.itemId]);

	useEffect(fetchItem, [fetchItem]);

	return {
		item,
		toggleEditItemName,
		isEditItemName,
		stock,
		stockTableData,
		goPrevPage,
		editItemNameValue,
		itemNameValue,
		isEditItemPrice,
		editItemPriceValue,
		toggleEditItemPrice,
		itemPriceValue,
		updateItem,
		isUpdateItemLoading,
		toggleEditItemCategory,
		isEditItemCategory,
		fetchItem,
	};
};
