import React from "react";
import "twin.macro";
import { CategoryModal, ItemTable } from "./components";
import { CreateItemModal } from "./components/create-item-modal";
import { DeleteItemModal } from "./components/delete-item-modal";
import { useItemSelector } from "./hooks";

export const ItemView: React.FC = () => {
	const {
		closeModal,
		isCategoryModalOpen,
		isCreateModalOpen,
		isDeleteModalOpen,
		onActionItemId,
		openDeleteModal,
		setCategoryModalOpen,
		setCreateModalOpen,
		goToItemDetailPage,
		isFetching,
	} = useItemSelector();

	return (
		<div tw="h-full">
			<ItemTable
				onCreateButtonClick={() => setCreateModalOpen(true)}
				onDeleteButtonClick={openDeleteModal}
				onCategoryButtonClick={() => setCategoryModalOpen(true)}
				onViewButtonClick={goToItemDetailPage}
				isLoading={isFetching}
			/>
			<DeleteItemModal
				isModalOpen={isDeleteModalOpen}
				itemId={onActionItemId}
				closeModal={closeModal}
			/>
			<CreateItemModal
				isModalOpen={isCreateModalOpen}
				closeModal={() => setCreateModalOpen(false)}
			/>
			<CategoryModal isOpen={isCategoryModalOpen} closeModal={() => setCategoryModalOpen(false)} />
		</div>
	);
};
