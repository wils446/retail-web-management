import { Modal, Select } from "@components";
import { ItemResponse } from "@libs/redux";
import "twin.macro";
import { useChangeCategorySelector } from "../hooks";
import tw from "twin.macro";

type ChangeCategoryProps = {
	isOpen: boolean;
	closeModal: () => void;
	item: ItemResponse;
	onSuccess?: () => void;
};

export const ChangeCategoryModal: React.FC<ChangeCategoryProps> = (props) => {
	const {
		categories,
		editItemCategoryValue,
		itemCategoryValue,
		closeModal,
		onChangeButtonClick,
		isUpdateItemLoading,
	} = useChangeCategorySelector(props.item, props.closeModal, props.onSuccess);

	return (
		<Modal title="Ubah Kategori" isOpen={props.isOpen} overlayOnClick={closeModal}>
			<div tw="pb-5 px-10">
				<div tw="space-y-5">
					<div tw="flex">
						<Select
							options={["none", ...categories.map((category) => category.name)]}
							defaultValue={itemCategoryValue}
							label="category"
							showLabel
							onChange={editItemCategoryValue}
							className="w-full"
							extraSelectStyle={tw`w-[12rem]`}
						/>
					</div>
					<div tw="flex justify-around space-x-5">
						<button
							tw="px-3 py-1 bg-red-500 text-white hover:bg-red-600 rounded"
							onClick={onChangeButtonClick}
							disabled={isUpdateItemLoading}
						>
							update
						</button>
						<button
							tw="px-3 py-1 bg-gray-800 text-white hover:bg-gray-950 rounded"
							onClick={closeModal}
							disabled={isUpdateItemLoading}
						>
							cancel
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};
