import Image from "next/image";
import React from "react";
import tw, { TwStyle } from "twin.macro";
import * as icons from "./icons";

export type Icon = keyof typeof icons;
type IconSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

const iconSizeVariants: Record<IconSize, TwStyle> = {
	xs: tw`w-1 h-1 2xl:(w-2 h-2)`,
	sm: tw`w-2 h-2 2xl:(w-3 h-3)`,
	base: tw`w-3 h-3 2xl:(w-4 h-4)`,
	lg: tw`w-4 h-4  2xl:(w-5 h-5)`,
	xl: tw`w-5 h-5 2xl:(w-6 h-6)`,
	"2xl": tw`w-6 h-6 2xl:(w-8 h-8)`,
	"3xl": tw`w-8 h-8 2xl:(w-10 h-10)`,
	"4xl": tw`w-10 h-10 2xl:(w-12 h-12)`,
};

type IconProps = {
	icon: Icon;
	size: IconSize;
};

export const Icon: React.FC<IconProps> = (props) => {
	return <Image src={icons[props.icon]} css={[iconSizeVariants[props.size]]} alt="icon" />;
};
