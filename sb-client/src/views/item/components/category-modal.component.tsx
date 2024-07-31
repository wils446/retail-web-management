import { Button, Icon, Input, Modal, Text } from "@components";
import "twin.macro";
import tw from "twin.macro";
import { useCategorySelector } from "../hooks";

type CategoryModalProps = {
	isOpen: boolean;
	closeModal: () => void;
};

const StyledCreateButton = tw.button`bg-indigo-500 rounded-lg px-2 text-white flex items-center space-x-0.5 hover:(bg-indigo-600) disabled:(bg-indigo-600) py-1`;
const StyledCancelButton = tw.button`bg-red-500 rounded-lg px-2 text-white flex items-center space-x-0.5 hover:(bg-red-600) py-1`;
const StyledButton = tw.button`w-24 py-2 text-white  rounded`;

export const CategoryModal: React.FC<CategoryModalProps> = (props) => {
	const {
		categories,
		createCategory,
		createValue,
		deleteCategory,
		editCategoryValue,
		isDeleteCategoryLoading,
		onConfirmDelete,
		onCreateMode,
		onEditCategory,
		resetCreateState,
		resetDeleteState,
		resetEditState,
		setConfirmDelete,
		setCreateValue,
		setEditCategoryValue,
		setEditMode,
		setOnCreateMode,
		updateCategory,
		isCreateCategoryLoading,
		close,
		isUpdateCategoryLoading,
		deleteCategoryId,
	} = useCategorySelector({
		closeModal: props.closeModal,
	});

	return (
		<Modal isOpen={props.isOpen} overlayOnClick={close} title="Kategori">
			<div tw=" w-[28rem] px-4">
				<div tw="flex justify-between items-center mb-2">
					{/* appear when on create mode */}
					{onCreateMode ? (
						<>
							<Input
								label=""
								value={createValue}
								onChange={(e) => setCreateValue(e.target.value)}
							/>
							<div tw="flex space-x-1">
								<Button
									buttonColor="blue"
									disabled={!!!createValue.length}
									onClick={createCategory}
								>
									<Text.H5>Tambah</Text.H5>
								</Button>
								<Button buttonColor="red" onClick={() => resetCreateState()}>
									<Text.H5>Batal</Text.H5>
								</Button>
							</div>
						</>
					) : (
						<Button
							buttonColor="blue"
							disabled={!!onEditCategory || onConfirmDelete}
							onClick={() => {
								setOnCreateMode(true);
							}}
						>
							<Icon icon="plus" size="lg" />
							<Text.H5>Tambah Kategori</Text.H5>
						</Button>
					)}
				</div>

				<div tw="max-h-96 w-full overflow-y-auto overflow-x-hidden border rounded">
					{onConfirmDelete ? (
						<div tw="py-8 flex flex-col items-center justify-center w-full space-y-5">
							<Text.H3 tw="font-semibold">
								hapus kategori{" "}
								{categories.find((category) => category.id === deleteCategoryId)?.name}?
							</Text.H3>
							<div tw="flex space-x-5">
								<StyledButton
									tw="bg-red-500 hover:(bg-red-600)"
									disabled={isDeleteCategoryLoading}
									onClick={deleteCategory}
								>
									hapus
								</StyledButton>
								<StyledButton
									tw="hover:bg-neutral-950 bg-neutral-900"
									disabled={isDeleteCategoryLoading}
									onClick={() => resetDeleteState()}
								>
									batalkan
								</StyledButton>
							</div>
						</div>
					) : (
						categories.map((category) => (
							<div tw="flex justify-between hover:bg-neutral-200 px-1 py-0.5" key={category.id}>
								{onEditCategory && onEditCategory === category.id ? (
									<Input
										label=""
										value={editCategoryValue}
										onChange={(e) => setEditCategoryValue(e.target.value)}
									/>
								) : (
									<Text.H4>{category.name}</Text.H4>
								)}
								<div tw="flex">
									{/* its disappear when on create and edit mode */}
									{!onEditCategory && !onCreateMode && (
										<>
											<button onClick={() => setEditMode(category.id, category.name)}>
												<Icon icon="edit" size="lg" />
											</button>
											<button onClick={() => setConfirmDelete(category.id)}>
												<Icon icon="trash" size="lg" />
											</button>
										</>
									)}
									{/* appear when on edit mode */}
									{onEditCategory === category.id && (
										<>
											<button onClick={async () => await updateCategory(category.name)}>
												<Icon icon="check" size="lg" />
											</button>
											<button onClick={() => resetEditState()}>
												<Icon icon="cross" size="lg" />
											</button>
										</>
									)}
								</div>
							</div>
						))
					)}
				</div>
				<div tw="flex justify-center pt-5 pb-3">
					<Button
						buttonColor="neutral"
						onClick={close}
						disabled={isUpdateCategoryLoading || isCreateCategoryLoading || isDeleteCategoryLoading}
					>
						tutup
					</Button>
				</div>
			</div>
		</Modal>
	);
};
