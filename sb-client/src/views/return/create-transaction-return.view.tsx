import { Button, Card, Icon, SkeletonTable, Text } from "@components";
import "twin.macro";
import { AddReturnItemModal, EditReturnItemModal } from "./components";
import { useTransactionReturnSelector } from "./hooks";

export const TransactionReturnView: React.FC = () => {
	const {
		addReturnItem,
		returnItems,
		router,
		transaction,
		isAddReturnItem,
		closeAddReturnItemModal,
		openAddReturnItemModal,
		modifiedReturnItems,
		editReturnItemId,
		onCloseEditButtonClick,
		onEditButtonClick,
		deleteReturnItem,
		editReturnItem,
		onSubmitButtonClick,
		isCreateReturnLoading,
		transactionDate,
		returableItems,
	} = useTransactionReturnSelector();

	return (
		transaction && (
			<>
				<Card>
					<Text.H2 tw="font-semibold text-center py-5">Retur</Text.H2>
					<div tw="flex flex-col space-y-2">
						<div tw="flex flex-col">
							<Text.H4>Nama : {transaction.name}</Text.H4>
							<Text.H4>Tanggal Transaksi : {transactionDate}</Text.H4>
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
					isOpen={isAddReturnItem}
					closeModal={closeAddReturnItemModal}
					returnItems={returnItems}
					handleAddButton={addReturnItem}
					returableItems={returableItems}
					isTransaction
				/>
				<EditReturnItemModal
					isOpen={!!editReturnItemId}
					closeModal={onCloseEditButtonClick}
					editItemId={editReturnItemId}
					onEditButtonClick={editReturnItem}
					returnItems={returnItems}
					onDeleteButtonClick={deleteReturnItem}
					isTransaction
				/>
			</>
		)
	);
};
