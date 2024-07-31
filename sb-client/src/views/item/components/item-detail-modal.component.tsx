// import { Button, Modal, Text } from "@components";
// import "twin.macro";
// import { useItemDetailSelector } from "../hooks";

// type ItemDetailModalProps = {
// 	isOpen: boolean;
// 	itemId: string;
// 	closeModal: () => void;
// };

// export const ItemDetailModal: React.FC<ItemDetailModalProps> = (props) => {
// 	const { closeModal, item, totalStock, stockDetail } = useItemDetailSelector({
// 		closeModal: props.closeModal,
// 		itemId: props.itemId,
// 	});

// 	return (
// 		<Modal isOpen={props.isOpen} overlayOnClick={closeModal} title="Item">
// 			<div tw="w-96 px-5">
// 				<div tw="flex flex-col space-y-2">
// 					<Text.H4>Total Stok : {totalStock}</Text.H4>
// 					<div tw="flex flex-col">
// 						<Text.H4 tw="mb-1">Stok Detail : </Text.H4>
// 						{stockDetail.map((data, index) => (
// 							<div key={index} tw="flex justify-between">
// 								<Text.H4>{data.cost}</Text.H4>
// 								<Text.H4>{data.stock}</Text.H4>
// 							</div>
// 						))}
// 					</div>
// 					<div tw="py-2 flex justify-center mt-5 space-x-4">
// 						<Button buttonColor="neutral" onClick={closeModal}>
// 							Tutup
// 						</Button>
// 					</div>
// 				</div>
// 			</div>
// 		</Modal>
// 	);
// };
