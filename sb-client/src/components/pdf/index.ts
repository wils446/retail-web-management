import {
	Body,
	Divider,
	Footer,
	Header,
	HeaderContentLeft,
	HeaderContentRight,
	HeaderTitle,
	UnderlineBox,
} from "./pdf.component";
import { SkeletonTable } from "./table.component";
import { Caption, Caption2, Title, Title2 } from "./text.component";

export * from "./dom-to-pdf.component";

export const PDF = {
	Table: SkeletonTable,
	Title,
	Title2,
	Caption,
	Caption2,
	Body,
	Footer,
	Header,
	HeaderContentLeft,
	HeaderTitle,
	HeaderContentRight,
	UnderlineBox,
	Divider,
};
