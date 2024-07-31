import React, { useMemo } from "react";
import { createPortal } from "react-dom";
import tw, { styled } from "twin.macro";
import { Text } from "../text";

type ModalProps = {
	isOpen: boolean;
	overlayOnClick?: () => void;
	children: React.ReactNode;
	title?: string;
};

const ModalContainer = styled.div.withConfig({
	shouldForwardProp: (props) => !["isOpen"].includes(props),
})<{ isOpen: boolean }>(({ isOpen }) => [!isOpen && tw`hidden`]);

const ModalOverlay = tw.div`absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-10`;
const StyledModal = tw.div`bg-white rounded p-2 z-20`;

export const Modal: React.FC<ModalProps> = (props) => {
	const title = useMemo(() => props.title, [props.title]);

	if (!props.isOpen) return null;

	return createPortal(
		<ModalContainer isOpen={props.isOpen}>
			<ModalOverlay onClick={props.overlayOnClick}>
				<StyledModal
					onClick={(ev) => {
						ev.stopPropagation();
					}}
				>
					{props.title && (
						<Text.H2 tw="text-xl 2xl:text-2xl font-semibold text-center py-3 2xl:py-5 px-2">
							{title}
						</Text.H2>
					)}
					{props.children}
				</StyledModal>
			</ModalOverlay>
		</ModalContainer>,
		document.getElementById("modal-popup")!
	);
};
