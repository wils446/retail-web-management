import { ReturnTable } from "./components";
import { useReturnSelector } from "./hooks";

export const ReturnView: React.FC = () => {
	useReturnSelector();

	return (
		<div>
			<ReturnTable />
		</div>
	);
};
