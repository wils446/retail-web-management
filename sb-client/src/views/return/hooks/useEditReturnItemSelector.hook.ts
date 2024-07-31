import { useCallback, useEffect, useState } from "react";
import { ReturnItemProps } from "./useAddReturnItemSelector";

type EditReturnItemState = {
	name: string;
	quantity: number;
	returnPrice: number;
	isSellable: boolean;
};

const initialEditReturnItemValue: EditReturnItemState = {
	name: "",
	quantity: 0,
	returnPrice: 0,
	isSellable: false,
};

export const useEditReturnItemSelector = (
	itemId: string,
	returnItems: ReturnItemProps[],
	onEditButtonClickFn: (item: ReturnItemProps) => void,
	onDeleteButtonClickFn: (id: string) => void,
	closeModalFn: () => void
) => {
	const [isEditPrice, setIsEditPrice] = useState(false);
	const [editItemValue, setEditItemValue] = useState<EditReturnItemState>(
		initialEditReturnItemValue
	);

	const updateEditItemValue = useCallback(function <T extends keyof EditReturnItemState>(
		key: T,
		value: EditReturnItemState[T]
	) {
		setEditItemValue((prev) => ({ ...prev, [key]: value }));
	},
	[]);

	const updateQuantity = (count: number) =>
		setEditItemValue((prev) => ({ ...prev, quantity: count }));

	const toggleEditPrice = () => setIsEditPrice((prev) => !prev);

	const toggleIsSellable = () =>
		setEditItemValue((prev) => ({ ...prev, isSellable: !prev.isSellable }));

	useEffect(() => {
		const returnItem = returnItems.find((item) => item.id === itemId);
		if (!returnItem) return setEditItemValue(initialEditReturnItemValue);
		setEditItemValue({
			name: returnItem.name,
			quantity: returnItem.quantity,
			returnPrice: returnItem.returnPrice,
			isSellable: returnItem.isSellable,
		});
	}, [itemId, returnItems]);

	const closeModal = () => {
		setEditItemValue(initialEditReturnItemValue);
		closeModalFn();
	};

	const onEditButtonClick = () => {
		onEditButtonClickFn({ id: itemId, ...editItemValue });
		closeModal();
	};

	const onDeleteButtonClick = () => {
		onDeleteButtonClickFn(itemId);
		closeModal();
	};

	return {
		editItemValue,
		updateEditItemValue,
		updateQuantity,
		toggleEditPrice,
		isEditPrice,
		closeModal,
		onEditButtonClick,
		onDeleteButtonClick,
		toggleIsSellable,
	};
};
