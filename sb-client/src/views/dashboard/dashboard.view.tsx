import "twin.macro";
import { ListCard, Summary } from "./components";
import { useDashboardSelector } from "./hooks";

export const DashboardView: React.FC = () => {
	useDashboardSelector();

	return (
		<div tw="w-full flex flex-col justify-center p-5 space-y-4">
			<Summary />
			<div tw="flex space-x-5">
				<ListCard label="Transaksi" />
				<ListCard label="Order" />
			</div>
		</div>
	);
};
