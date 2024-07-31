import { useAppSelector, usePromiseToast } from "@libs/hooks";
import {
	useCreateCategoryMutation,
	useDeleteCategoryMutation,
	useUpdateCategoryMutation,
} from "@libs/redux";
import { useCallback, useState } from "react";

type Props = {
	closeModal: () => void;
};

export const useCategorySelector = (props: Props) => {
	const { endLoading, startLoading } = usePromiseToast();
	const categories = useAppSelector((state) => state.categoryReducer);
	const [onEditCategory, setEditCategory] = useState("");
	const [editCategoryValue, setEditCategoryValue] = useState("");
	const [onConfirmDelete, setOnConfirmDelete] = useState(false);
	const [deleteCategoryId, setDeleteCategoryId] = useState("");
	const [updateFn, { isLoading: isUpdateCategoryLoading }] =
		useUpdateCategoryMutation();
	const [createCategoryFn, { isLoading: isCreateCategoryLoading }] =
		useCreateCategoryMutation();
	const [deleteCategoryFn, { isLoading: isDeleteCategoryLoading }] =
		useDeleteCategoryMutation();

	const [onCreateMode, setOnCreateMode] = useState(false);
	const [createValue, setCreateValue] = useState("");

	const setEditMode = useCallback((id: string, name: string) => {
		setEditCategory(id);
		setEditCategoryValue(name);
	}, []);

	const setConfirmDelete = useCallback((id: string) => {
		setOnConfirmDelete(true);
		setDeleteCategoryId(id);
	}, []);

	const resetEditState = useCallback(() => {
		setEditCategory("");
		setEditCategoryValue("");
	}, []);

	const resetCreateState = useCallback(() => {
		setOnCreateMode(false);
		setCreateValue("");
	}, []);

	const resetDeleteState = useCallback(() => {
		setOnConfirmDelete(false);
		setDeleteCategoryId("");
	}, []);

	const close = useCallback(() => {
		if (
			isCreateCategoryLoading ||
			isUpdateCategoryLoading ||
			isDeleteCategoryLoading
		)
			return;
		resetCreateState();
		resetEditState();
		resetDeleteState();
		props.closeModal();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		isCreateCategoryLoading,
		isUpdateCategoryLoading,
		isDeleteCategoryLoading,
	]);

	const updateCategory = useCallback(
		async (categoryName: string) => {
			if (editCategoryValue === categoryName) return resetEditState();
			startLoading();
			const response = await updateFn({
				id: onEditCategory,
				name: editCategoryValue,
			});
			endLoading(response, "Edit berhasil");
			resetEditState();
		},
		[editCategoryValue, onEditCategory] // eslint-disable-line react-hooks/exhaustive-deps
	);

	const createCategory = useCallback(async () => {
		if (!createValue) return;
		startLoading();
		const response = await createCategoryFn({ name: createValue });
		endLoading(response, "Kategori berhasil ditambahkan");
		resetCreateState();
	}, [createValue]); // eslint-disable-line react-hooks/exhaustive-deps

	const deleteCategory = useCallback(async () => {
		startLoading();
		const response = await deleteCategoryFn({ id: deleteCategoryId });
		endLoading(response, "Kategori berhasil dihapus");
		resetDeleteState();
	}, [deleteCategoryId]); // eslint-disable-line react-hooks/exhaustive-deps

	return {
		onCreateMode,
		setCreateValue,
		createValue,
		createCategory,
		resetCreateState,
		onEditCategory,
		onConfirmDelete,
		setOnCreateMode,
		categories,
		deleteCategory,
		isDeleteCategoryLoading,
		resetDeleteState,
		editCategoryValue,
		setEditCategoryValue,
		setEditMode,
		setConfirmDelete,
		updateCategory,
		resetEditState,
		close,
		isUpdateCategoryLoading,
		isCreateCategoryLoading,
		deleteCategoryId,
	};
};
