import { useAppSelector, usePromiseToast } from "@libs/hooks";
import { ItemResponse, ItemState, useUpdateItemMutation } from "@libs/redux";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";

export const useChangeCategorySelector = (
	item: ItemResponse,
	closeModalFn: () => void,
	onSuccess?: () => void
) => {
	const categories = useAppSelector((state) => state.categoryReducer);

	const { startLoading, endLoading } = usePromiseToast();
	const [updateItem, { isLoading: isUpdateItemLoading }] = useUpdateItemMutation();

	const [itemCategoryValue, setItemCategoryValue] = useState("none");

	const editItemCategoryValue = useCallback(
		(e: ChangeEvent<HTMLSelectElement>) => setItemCategoryValue(e.target.value),
		[]
	);

	const category = useMemo(
		() => categories.find((category) => category.name === itemCategoryValue),
		[itemCategoryValue, categories]
	);

	const closeModal = () => {
		if (isUpdateItemLoading) return;
		closeModalFn();
	};

	const onChangeButtonClick = useCallback(async () => {
		startLoading();
		const response = await updateItem({
			id: item.id,
			categoryId: category?.id,
		});
		if (onSuccess) await onSuccess();
		endLoading(response, "Edit berhasil");
		closeModal();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [itemCategoryValue, category?.id, item.id, onSuccess]);

	useEffect(() => {
		setItemCategoryValue(item.category?.name || "none");
	}, [item.category?.name]);

	return {
		categories,
		editItemCategoryValue,
		itemCategoryValue,
		onChangeButtonClick,
		closeModal,
		isUpdateItemLoading,
	};
};
