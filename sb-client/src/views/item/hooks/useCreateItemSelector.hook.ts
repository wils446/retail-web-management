import { useAppSelector, usePromiseToast } from "@libs/hooks";
import { useCreateItemMutation } from "@libs/redux";
import { useCallback, useState } from "react";

type Props = {
	closeModal: () => void;
};

type ItemState = {
	name: string;
	price: number;
	category: string;
};

const initialItemState: ItemState = {
	name: "",
	price: 0,
	category: "none",
};

export const useCreateItemSelector = (props: Props) => {
	const [createItemFn, { isLoading: isCreateItemLoading }] =
		useCreateItemMutation();
	const { startLoading, endLoading } = usePromiseToast();
	const categories = useAppSelector((state) => state.categoryReducer);

	const [itemValue, setItemValue] = useState<ItemState>(initialItemState);

	const updateItemValue = useCallback(
		function <T extends keyof ItemState>(key: T, value: ItemState[T]) {
			setItemValue({ ...itemValue, [key]: value });
		},
		[itemValue]
	);

	const clearInput = useCallback(() => {
		setItemValue(initialItemState);
	}, []);

	const closeModal = useCallback(() => {
		if (isCreateItemLoading) return;
		props.closeModal();
		clearInput();
	}, [isCreateItemLoading]); // eslint-disable-line react-hooks/exhaustive-deps

	const createItem = useCallback(async () => {
		const { category: categoryValue, name, price } = itemValue;
		const categoryId = categories.find(
			(category) => category.name === categoryValue
		)?.id;
		startLoading();
		const response = await createItemFn({
			name,
			price,
			categoryId,
		});
		endLoading(response, "Tambah barang berhasil!");
		closeModal();
	}, [itemValue, closeModal, categories]); // eslint-disable-line react-hooks/exhaustive-deps

	return {
		itemValue,
		updateItemValue,
		categories,
		createItem,
		isCreateItemLoading,
		closeModal,
	};
};
