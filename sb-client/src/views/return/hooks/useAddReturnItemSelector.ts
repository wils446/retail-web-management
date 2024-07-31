import { useCallback, useMemo, useState } from "react";

export type ReturnItemProps = {
	id: string;
	name: string;
	quantity: number;
	returnPrice: number;
	isSellable: boolean;
};

type AddReturnItemState = {
	name: string;
	quantity: number;
	returnPrice: number;
	isSellable: boolean;
};

export type ItemList = {
	id: string;
	name: string;
	quantity: number;
};

const addReturnItemInitialState: AddReturnItemState = {
	name: "",
	quantity: 1,
	returnPrice: 0,
	isSellable: false,
};

export const useAddReturnItemSelector = (
	returnItems: ReturnItemProps[],
	handleAddButtonFn: (item: ReturnItemProps) => void,
	closeModalFn: () => void,
	returableItems: ItemList[]
) => {
	const [returnItemValue, setReturnItemValue] =
		useState<AddReturnItemState>(addReturnItemInitialState);

	const updateReturnItem = useCallback(
		function <T extends keyof AddReturnItemState>(key: T, value: AddReturnItemState[T]) {
			setReturnItemValue((prev) => ({ ...prev, [key]: value }));
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[returnItemValue]
	);

	const updateQuantity = (count: number) => {
		setReturnItemValue((prev) => ({ ...prev, quantity: count }));
	};

	const toggleIsSellable = () =>
		setReturnItemValue((prev) => ({ ...prev, isSellable: !prev.isSellable }));

	const itemList = useMemo(() => {
		const addedItems = returnItems.map((item) => item.name);

		return returableItems
			.map((item) => item.name)
			.filter((itemName) => !addedItems.includes(itemName));
	}, [returableItems, returnItems]);

	const itemQuantity = useMemo(() => {
		const items = returableItems.find((item) => item.name === returnItemValue.name);

		return items ? items.quantity : Infinity;
	}, [returableItems, returnItemValue]);

	const choosenItemId = useMemo(
		() => returableItems.find((item) => item.name === returnItemValue.name)?.id || "",
		[returnItemValue.name, returableItems]
	);

	const resetState = () => setReturnItemValue(addReturnItemInitialState);

	const closeModal = () => {
		resetState();
		closeModalFn();
	};

	const handleAddButton = () => {
		handleAddButtonFn({ id: choosenItemId, ...returnItemValue });
		closeModal();
	};

	const quantityInputDisable = useMemo(
		() => returnItemValue.quantity === 0 || returnItemValue.quantity === itemQuantity,
		[returnItemValue.quantity, itemQuantity]
	);

	return {
		itemList,
		returnItemValue,
		updateReturnItem,
		updateQuantity,
		itemQuantity,
		closeModal,
		handleAddButton,
		quantityInputDisable,
		toggleIsSellable,
	};
};
