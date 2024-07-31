import { Button, Card, Icon, SkeletonTable, Text } from "@components";
import "twin.macro";
import { AddReturnItemModal, EditReturnItemModal } from "./components";
import { useCreateOrderReturnSelector } from "./hooks";

export const CreateOrderReturnView: React.FC = () => {
	const {
		addReturnItem,
		closeAddReturnItemModal,
		deleteReturnItem,
		editReturnItem,
		editReturnItemId,
		isAddReturnItem,
		isCreateReturnLoading,
		modifiedReturnItems,
		onCloseEditButtonClick,
		onEditButtonClick,
		onSubmitButtonClick,
		openAddReturnItemModal,
		order,
		orderDate,
		returnItems,
		router,
		returableItems,
	} = useCreateOrderReturnSelector();

	return (
		order && (
			<>
				<Card>
					<Text.H2 tw="font-semibold text-center py-5">Retur</Text.H2>
					<div tw="flex flex-col space-y-2">
						<div tw="flex flex-col">
							<Text.H4>Nama : {order.name}</Text.H4>
							<Text.H4>Tanggal Order : {orderDate}</Text.H4>
							<div tw="flex justify-between pb-2">
								<Text.H4>Barang : </Text.H4>
								<Button onClick={openAddReturnItemModal} buttonColor="blue">
									<Icon icon="plus" size="base" />
									Tambah Barang Retur
								</Button>
							</div>
							<SkeletonTable
								data={modifiedReturnItems}
								titles={["nama", "qty", "harga"]}
								actions={[
									{
										icon: "edit",
										onClick: onEditButtonClick,
									},
								]}
							/>
							<div tw="flex pt-10 pb-3 space-x-5 justify-center">
								<Button
									onClick={onSubmitButtonClick}
									buttonColor="blue"
									disabled={!!!returnItems.length || isCreateReturnLoading}
								>
									Submit
								</Button>
								<Button
									onClick={() => router.back()}
									buttonColor="neutral"
									disabled={isCreateReturnLoading}
								>
									Kembali
								</Button>
							</div>
						</div>
					</div>
				</Card>
				<AddReturnItemModal
					closeModal={closeAddReturnItemModal}
					handleAddButton={addReturnItem}
					isOpen={isAddReturnItem}
					returnItems={returnItems}
					returableItems={returableItems}
				/>
				<EditReturnItemModal
					closeModal={onCloseEditButtonClick}
					editItemId={editReturnItemId}
					isOpen={!!editReturnItemId}
					onDeleteButtonClick={deleteReturnItem}
					onEditButtonClick={editReturnItem}
					returnItems={returnItems}
				/>
			</>
		)
	);
};
