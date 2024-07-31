import { useAppSelector } from "@libs/hooks";
import { useDeleteItemMutation } from "@libs/redux";

type Props = {
	itemId: string;
	closeModal: () => void;
};

export const useDeleteItemSelector = (props: Props) => {
	const [deleteFn, { isLoading }] = useDeleteItemMutation();
	const items = useAppSelector((state) => state.itemReducer);

	const onDeleteButtonClick = () => {
		deleteFn({ id: props.itemId }).then(props.closeModal);
	};

	return {
		items,
		onDeleteButtonClick,
		isLoading,
	};
};
