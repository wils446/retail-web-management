import React from "react";
import { EditOrderModal, OrderTable } from "./components";
import { useOrderSelector } from "./hooks";

export const OrderView: React.FC = () => {
	const { editOrderId, setEditOrderId } = useOrderSelector();

	return (
		<div>
			<OrderTable onEditButtonClick={setEditOrderId} />
			<EditOrderModal
				closeModal={() => setEditOrderId("")}
				isOpen={!!editOrderId}
				orderId={editOrderId}
			/>
		</div>
	);
};
