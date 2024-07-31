import { Text } from "@components";
import { useId } from "react";
import "twin.macro";
import { useSummaryCardSelector } from "../hooks";

type SummaryData = {
	counts: number;
	totalPriceOrCost: string;
	totalItems: number;
	type: string;
};

const SummaryCard: React.FC<{ data: SummaryData }> = (props) => {
	return (
		<div tw="bg-white p-5 w-[16rem] 2xl:w-[24rem] border rounded">
			<Text.H3>{props.data.type}</Text.H3>
			<Text.H1 tw="font-extrabold text-4xl">{props.data.counts}</Text.H1>
			<Text.H4>{props.data.totalPriceOrCost}</Text.H4>
		</div>
	);
};

export const Summary: React.FC = () => {
	const { summaryData } = useSummaryCardSelector();
	const id = useId();

	return (
		<div tw="w-full flex justify-between">
			{summaryData.map((data) => (
				<SummaryCard key={`${id}-${data.type}`} data={data} />
			))}
		</div>
	);
};
