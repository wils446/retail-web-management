import { useId } from "react";
import "twin.macro";

type CheckboxProps = {
	label: string;
	isChecked: boolean;
	onChangeHandler: () => void;
};

export const Checkbox: React.FC<CheckboxProps> = (props) => {
	const id = useId();

	return (
		<div tw="flex items-center">
			<input
				checked={props.isChecked}
				id={`${id}-checkbox`}
				type="checkbox"
				value=""
				tw="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
				onChange={props.onChangeHandler}
			/>
			<label
				htmlFor={`${id}-checkbox`}
				tw="ms-2 text-sm font-light text-gray-900"
			>
				{props.label}
			</label>
		</div>
	);
};
