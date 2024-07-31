import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useState,
} from "react";

type OrderItem = {
	id: string;
	name: string;
	quantity: number;
	cost: number;
};

type Props = {
	itemId: string;
	closeModal: () => void;
	orderItems: OrderItem[];
	setOrderItem: Dispatch<SetStateAction<OrderItem[]>>;
};

type EditItemState = {
	name: string;
	cost: number;
	quantity: number;
};

const initialEditItemState: EditItemState = {
	name: "",
	cost: 0,
	quantity: 1,
};

export const useEditOrderItemSelector = (props: Props) => {
	const [itemValue, setItemValue] =
		useState<EditItemState>(initialEditItemState);

	const updateItemValue = useCallback(
		function <T extends keyof EditItemState>(key: T, value: EditItemState[T]) {
			setItemValue({
				...itemValue,
				[key]: value,
			});
		},
		[itemValue]
	);

	const updateOrderItem = useCallback(() => {
		if (!props.itemId) return;
		const orderItems = props.orderItems.map((item) => {
			if (item.id !== props.itemId) return item;

			return {
				...item,
				...itemValue,
			};
		});
		props.setOrderItem(orderItems);
		props.closeModal();
	}, [props.itemId, itemValue, props.orderItems]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		const item = props.orderItems.find(
			(orderItem) => orderItem.id === props.itemId
		);
		if (!item) return;
		setItemValue({
			cost: item.cost,
			quantity: item.quantity,
			name: item.name,
		});
	}, [props.itemId, props.orderItems]);

	return {
		itemValue,
		updateItemValue,
		updateOrderItem,
	};
};
