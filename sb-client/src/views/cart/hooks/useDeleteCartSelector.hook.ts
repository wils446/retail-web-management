import { usePromiseToast } from "@libs/hooks";
import { useDeleteCartMutation } from "@libs/redux";
import { useRouter } from "next/navigation";

export const useDeleteCartSelector = (
	cartId: string,
	closeModalFn: () => void
) => {
	const router = useRouter();
	const { endLoading, startLoading } = usePromiseToast();
	const [deleteCartFn, { isLoading: isDeleteCartLoading }] =
		useDeleteCartMutation();

	const closeModal = () => {
		if (isDeleteCartLoading) return;
		closeModalFn();
	};

	const deleteCart = async () => {
		startLoading();
		const response = await deleteCartFn({ id: cartId });
		endLoading(response, "Keranjang berhasil dihapus");
		closeModal();
		router.back();
	};

	return {
		closeModal,
		deleteCart,
	};
};
