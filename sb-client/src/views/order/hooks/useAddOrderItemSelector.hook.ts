import { useAppSelector, useQueryString } from "@libs/hooks";
import { ItemResponse, useLazyGetItemsQuery } from "@libs/redux";
import { useDebounce } from "@uidotdev/usehooks";
import { useCallback, useEffect, useMemo, useState } from "react";

type OrderItem = {
	id: string;
	name: string;
	quantity: number;
	cost: number;
};

type Props = {
	onAddButtonClick: (item: OrderItem) => void;
	closeModal: () => void;
};

type AddItemState = {
	name: string;
	quantity: number;
	cost: number;
};

const initialItemState: AddItemState = {
	name: "",
	quantity: 1,
	cost: 0,
};

export const useAddOrderItemSelector = (props: Props) => {
	const [getItem] = useLazyGetItemsQuery();
	const { createQueryString } = useQueryString();

	const [itemList, setItemList] = useState<ItemResponse[]>([]);
	const [addItemValue, setAddItemValue] = useState<AddItemState>(initialItemState);
	const debouncedItemName = useDebounce(addItemValue.name, 300);

	const updateItemValue = useCallback(
		function <T extends keyof AddItemState>(key: T, value: AddItemState[T]) {
			setAddItemValue({ ...addItemValue, [key]: value });
		},
		[addItemValue]
	);

	const itemId = useMemo(
		() => itemList.find((item) => item.name === addItemValue.name)?.id || "",
		[addItemValue, itemList]
	);

	const isItemNameValid = useMemo(() => {
		for (let i = 0; i < itemList.length; i++) {
			if (addItemValue.name === itemList[i].name) return true;
		}

		return false;
	}, [itemList, addItemValue]);

	const isCostValid = useMemo(() => addItemValue.cost > 0, [addItemValue]);

	const isValueValid = useMemo(
		() => isItemNameValid && isCostValid,
		[isItemNameValid, isCostValid]
	);

	const clearState = useCallback(() => {
		setAddItemValue(initialItemState);
	}, []);

	const closeModal = useCallback(() => {
		props.closeModal();
		clearState();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		getItem({ queryString: createQueryString("name", debouncedItemName) }).then((res) =>
			setItemList(res.data?.items || [])
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedItemName]);

	const addItem = useCallback(() => {
		const { name, cost, quantity } = addItemValue;
		props.onAddButtonClick({
			id: itemId,
			name,
			quantity,
			cost,
		});
		closeModal();
	}, [itemId, addItemValue, props]); // eslint-disable-line react-hooks/exhaustive-deps

	return {
		closeModal,
		addItemValue,
		updateItemValue,
		itemList,
		isValueValid,
		addItem,
	};
};
