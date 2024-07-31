import "twin.macro";

type CardProps = {
	children: React.ReactNode;
};

export const Card: React.FC<CardProps> = (props) => (
	<div tw="flex justify-center py-5">
		<div tw="bg-white w-[660px] 2xl:w-[768px] border px-3 pb-5 rounded">{props.children}</div>
	</div>
);
