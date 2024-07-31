import { Button, Card, Icon, Input, SkeletonTable, Text } from "@components";
import { convertRupiah } from "@libs/utils";
import "twin.macro";
import { ChangeCategoryModal } from "./components";
import { useItemDetailSelector } from "./hooks";
import { useLazyGetItemByIdQuery } from "@libs/redux";
import { useParams } from "next/navigation";
import { Suspense } from "react";

export const ItemDetailView: React.FC = () => {
	const params = useParams<{ itemId: string }>();
	const {
		item,
		toggleEditItemName,
		stock,
		isEditItemName,
		stockTableData,
		goPrevPage,
		editItemNameValue,
		itemNameValue,
		editItemPriceValue,
		isEditItemPrice,
		itemPriceValue,
		toggleEditItemPrice,
		updateItem,
		isUpdateItemLoading,
		toggleEditItemCategory,
		isEditItemCategory,
		fetchItem,
	} = useItemDetailSelector();

	return (
		item && (
			<>
				<Card>
					<Text.H2 tw="font-semibold text-center py-5">Barang</Text.H2>
					<div tw="flex flex-col space-y-2">
						<div tw="flex space-x-2">
							{isEditItemName ? (
								<>
									<Input
										label="Nama : "
										inline
										value={itemNameValue}
										onChange={editItemNameValue}
									/>
									<button
										tw="hover:opacity-70 disabled:opacity-70"
										disabled={!!!editItemNameValue}
										onClick={updateItem}
									>
										<Icon icon="check" size="lg" />
									</button>
									<button tw="hover:opacity-70 disabled:opacity-70" onClick={toggleEditItemName}>
										<Icon icon="cross" size="lg" />
									</button>
								</>
							) : (
								<>
									<Text.H4>Nama : {item.name ? item.name : item.id}</Text.H4>
									<button onClick={toggleEditItemName}>
										<Icon icon="edit" size="lg" />
									</button>
								</>
							)}
						</div>
						<div tw="flex space-x-2">
							{isEditItemPrice ? (
								<>
									<Input
										label="Harga : "
										inline
										value={itemPriceValue}
										onChange={editItemPriceValue}
									/>
									<button
										tw="hover:opacity-70 disabled:opacity-70"
										disabled={!!!editItemPriceValue}
										onClick={updateItem}
									>
										<Icon icon="check" size="lg" />
									</button>
									<button tw="hover:opacity-70 disabled:opacity-70" onClick={toggleEditItemPrice}>
										<Icon icon="cross" size="lg" />
									</button>
								</>
							) : (
								<>
									<Text.H4>Harga : {convertRupiah(item.price)}</Text.H4>
									<button onClick={toggleEditItemPrice}>
										<Icon icon="edit" size="lg" />
									</button>
								</>
							)}
						</div>
						<div tw="flex space-x-2">
							<Text.H4>Kategori : {item.category ? item.category.name : "-"}</Text.H4>
							<button onClick={toggleEditItemCategory}>
								<Icon icon="edit" size="lg" />
							</button>
						</div>
						<Text.H4>Total Stok : {stock}</Text.H4>
						<div tw="flex flex-col">
							<Text.H4>Stok Detail : </Text.H4>
							<SkeletonTable
								data={stockTableData}
								titles={["cost", "stock", "date"]}
								tableSize={[
									{ key: "date", size: "xl", center: true },
									{ key: "stock", size: "xl", center: true },
								]}
							/>
						</div>
					</div>
					<div tw="flex justify-center pt-5 space-x-5">
						<Button onClick={goPrevPage} disabled={isUpdateItemLoading} buttonColor="neutral">
							Kembali
						</Button>
					</div>
				</Card>
				<ChangeCategoryModal
					closeModal={toggleEditItemCategory}
					isOpen={isEditItemCategory}
					item={item}
					onSuccess={fetchItem}
				/>
			</>
		)
	);
};
