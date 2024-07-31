import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { RefObject } from "react";

export const usePdf = () => {
	const generateAndOpenPdf = async (ref: RefObject<HTMLDivElement>) => {
		if (!ref.current) return;
		const element = ref.current;
		const canvas = await html2canvas(element);
		const data = canvas.toDataURL("image/png");

		const pdf = new jsPDF({
			orientation: "p",
			unit: "mm",
			format: [210, 297],
		});

		// add canvas into pdf
		pdf.addImage(data, "PNG", 0, 0, 210, 297);

		// open pdf in new tab
		window.open(pdf.output("bloburl"), "_blank");
	};

	return { generateAndOpenPdf };
};
