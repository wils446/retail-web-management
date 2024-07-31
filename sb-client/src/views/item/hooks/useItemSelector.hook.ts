import { useItem, useQueryString } from "@libs/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const useItemSelector = () => {
	const router = useRouter();
	const pathname = usePathname();
	const { searchParams } = useQueryString();
	const { getItem, isFetching } = useItem();
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [isCreateModalOpen, setCreateModalOpen] = useState(false);
	const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
	const [onActionItemId, setOnActionItemId] = useState("");

	const openDeleteModal = useCallback((id: string) => {
		setDeleteModalOpen(true);
		setOnActionItemId(id);
	}, []);

	const closeModal = useCallback(() => {
		setDeleteModalOpen(false);
		setOnActionItemId("");
	}, []);

	const goToItemDetailPage = useCallback((id: string) => {
		router.push(`${pathname}/${id}`);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		getItem({ queryString: searchParams.toString() });
	}, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

	return {
		setCreateModalOpen,
		openDeleteModal,
		setCategoryModalOpen,
		onActionItemId,
		closeModal,
		isDeleteModalOpen,
		isCreateModalOpen,
		isCategoryModalOpen,
		goToItemDetailPage,
		isFetching,
	};
};
