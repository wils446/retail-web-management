import { Icon } from "@components";
import React from "react";
import "twin.macro";
import tw from "twin.macro";
import { Text } from "../../text";

type SidebarButtonType = {
	icon?: Icon;
	label: string;
	onClickHandler: () => void;
	active: boolean;
};

/* rowl px-2 -> px-4 */
const StyledButton = tw.button`flex w-full items-center space-x-1 px-4 py-2 border-y border-blue-950 hover:(bg-white bg-opacity-10 cursor-pointer)`;

export const SidebarButton: React.FC<SidebarButtonType> = (props) => {
	return (
		<StyledButton onClick={props.onClickHandler} css={[props.active && tw`bg-white bg-opacity-10`]}>
			{props.icon && <Icon icon={props.icon} size="lg" />}
			<Text.H4 tw="text-sm 2xl:text-base text-gray-100">{props.label}</Text.H4>
		</StyledButton>
	);
};
