import { useAppSelector, usePromiseToast } from "@libs/hooks";
import { useUpdateOrderMutation } from "@libs/redux";
import { useEffect, useState } from "react";

type Props = {
	closeModal: () => void;
	orderId: string;
};

export const useEditOrderSelector = (props: Props) => {
	const { endLoading, startLoading } = usePromiseToast();
	const orders = useAppSelector((state) => state.orderReducer);
	const order = orders.orders.find((order) => order.id === props.orderId);
	const [updateOrderFn, { isLoading: isUpdateOrderLoading }] = useUpdateOrderMutation();

	const [paidStatus, setPaidStatus] = useState(order?.paid ? "lunas" : "belum lunas");

	const initiateValue = () => {
		const order = orders.orders.find((order) => order.id === props.orderId);
		setPaidStatus(order?.paid ? "lunas" : "belum lunas");
	};

	const closeModal = () => {
		if (isUpdateOrderLoading) return;
		props.closeModal();
	};

	const updateOrder = async () => {
		startLoading();
		const response = await updateOrderFn({
			id: props.orderId,
			paid: paidStatus === "lunas",
		});
		endLoading(response, "Order berhasil diupdate");
		closeModal();
	};

	useEffect(initiateValue, [props.orderId, orders]);

	return {
		order,
		closeModal,
		paidStatus,
		updateOrder,
		setPaidStatus,
	};
};
