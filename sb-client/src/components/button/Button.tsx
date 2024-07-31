import tw, { styled } from "twin.macro";

type ButtonProps = {
	buttonColor: "red" | "blue" | "neutral" | "indigo";
};

export const Button = styled.button.withConfig({
	shouldForwardProp: (props) => !["buttonColor"].includes(props),
})<ButtonProps>(({ buttonColor }) => [
	tw`text-white px-4 py-1.5 rounded flex items-center border min-w-24 justify-center text-xs 2xl:text-sm`,
	buttonColor === "red" && tw`bg-red-500 hover:bg-red-700 disabled:bg-red-700`,
	buttonColor === "blue" && tw`bg-blue-500 hover:bg-blue-700 disabled:bg-blue-700`,
	buttonColor === "neutral" && tw`bg-neutral-700 hover:bg-neutral-800 disabled:bg-neutral-700`,
	buttonColor === "indigo" && tw`bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-600`,
]);
