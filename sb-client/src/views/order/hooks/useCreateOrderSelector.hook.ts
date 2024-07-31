import { usePromiseToast } from "@libs/hooks";
import { useCreateOrderMutation } from "@libs/redux";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type OrderItem = {
	id: string;
	name: string;
	quantity: number;
	cost: number;
};

export const useCreateOrderSelector = () => {
	const router = useRouter();
	const { endLoading, startLoading } = usePromiseToast();
	const [createOrderFn, { isLoading: isCreateOrderLoading }] =
		useCreateOrderMutation();

	const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
	const [orderName, setOrderName] = useState("");
	const [status, setStatus] = useState("belum lunas");
	const [isAddOrderItemModalOpen, setAddOrderItemModalOpen] = useState(false);
	const [editOrderItemId, setEditOrderItemId] = useState("");

	const addOrderItem = (item: OrderItem) => {
		setOrderItems((prev) => [item, ...prev]);
	};

	const isCanOrder = useMemo(
		() => !!orderName && !!orderItems.length,
		[orderItems, orderName]
	);

	const createOrder = async () => {
		startLoading();
		const response = await createOrderFn({
			name: orderName,
			paid: status === "lunas",
			items: orderItems.map((data) => ({
				itemId: data.id,
				quantity: data.quantity,
				cost: data.cost,
			})),
		});
		endLoading(response, "Order berhasil ditambahkan");
		router.push("/app/order");
	};

	const removeOrderItem = (itemId: string) => {
		setOrderItems([
			...orderItems.filter((orderItem) => orderItem.id !== itemId),
		]);
	};

	return {
		orderName,
		setOrderName,
		status,
		setStatus,
		setAddOrderItemModalOpen,
		createOrder,
		isCanOrder,
		orderItems,
		isAddOrderItemModalOpen,
		addOrderItem,
		editOrderItemId,
		setEditOrderItemId,
		setOrderItems,
		removeOrderItem,
	};
};
