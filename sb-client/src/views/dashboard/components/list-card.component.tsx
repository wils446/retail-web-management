import { Text } from "@components";
import "twin.macro";
import { useListCardSelector } from "../hooks";

type ListProps = {
	name: string;
	id: string;
	timestamp: string;
	onClick?: () => void;
};

const List: React.FC<ListProps> = (props) => {
	return (
		<div
			onClick={props.onClick}
			tw="py-1 flex justify-between hover:bg-neutral-50 px-2 hover:cursor-pointer items-center border-b border-neutral-100"
		>
			<Text.H4>{props.name}</Text.H4>
			<Text.H5>{props.timestamp}</Text.H5>
		</div>
	);
};

type ListCardProps = {
	label: "Transaksi" | "Order";
};

export const ListCard: React.FC<ListCardProps> = (props) => {
	const { list, listOnClick } = useListCardSelector(props.label);

	return (
		<div tw="w-full bg-white rounded-lg pb-2 border">
			<Text.H3 tw="p-2">{props.label}</Text.H3>
			<hr />
			{list.length ? (
				list.map((data, index) => (
					<List onClick={() => listOnClick(props.label, data.id)} key={index} {...data} />
				))
			) : (
				<div tw="py-4 flex justify-center">
					<Text.H4>Tidak ada transaksi hari ini.</Text.H4>
				</div>
			)}
		</div>
	);
};
