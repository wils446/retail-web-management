import tw from "twin.macro";

export const Header = tw.div`flex justify-between h-20 mb-10`;
export const HeaderContentLeft = tw.div`basis-1/3`;
export const HeaderContentRight = tw.div`basis-1/3 text-end`;
export const HeaderTitle = tw.div`text-center flex flex-col justify-end basis-1/3`;
export const Divider = tw.hr`border-t border-black -mb-2`;
export const Body = tw.div`mb-10 flex-col space-y-2`;
export const Footer = tw.div`flex justify-between`;
export const UnderlineBox = tw.div`border-b border-black w-32 h-16`;
