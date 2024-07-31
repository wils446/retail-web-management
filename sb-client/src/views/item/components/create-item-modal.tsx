import { Input, Modal, Select } from "@components";
import "twin.macro";
import { useCreateItemSelector } from "../hooks";

type CreateItemModal = {
	isModalOpen: boolean;
	closeModal: () => void;
};

export const CreateItemModal: React.FC<CreateItemModal> = (props) => {
	const {
		categories,
		createItem,
		isCreateItemLoading,
		itemValue,
		updateItemValue,
		closeModal,
	} = useCreateItemSelector({ closeModal: props.closeModal });

	return (
		<Modal
			isOpen={props.isModalOpen}
			overlayOnClick={props.closeModal}
			title="Tambah Barang"
		>
			<div tw="pb-2 px-10">
				<div tw="space-y-3 text-start">
					<Input
						label="name"
						type="text"
						onChange={(e) => updateItemValue("name", e.target.value)}
						value={itemValue.name}
					/>
					<Input
						label="price"
						type="number"
						onChange={(e) => updateItemValue("price", +e.target.value)}
						value={itemValue.price.toString()}
					/>
					<Select
						options={["none", ...categories.map((category) => category.name)]}
						label="category"
						showLabel
						defaultValue={itemValue.category}
						onChange={(e) => updateItemValue("category", e.target.value)}
					/>
					<div tw="flex justify-around space-x-5 py-4">
						<button
							tw="w-24 py-2 bg-red-500 text-white hover:bg-red-600 rounded"
							onClick={createItem}
							disabled={isCreateItemLoading}
						>
							create
						</button>
						<button
							tw="w-24 py-2 bg-gray-800 text-white hover:bg-gray-950 rounded"
							onClick={closeModal}
							disabled={isCreateItemLoading}
						>
							cancel
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};
