import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useRef } from "react";
import "twin.macro";

export const DomToPdfComponent = () => {
	const printRef = useRef<HTMLDivElement>(null);

	const handlePrintPdf = async () => {
		if (!printRef.current) return;
		const element = printRef.current;
		const canvas = await html2canvas(element);
		const data = canvas.toDataURL("image/png");

		// Membuat instance jsPDF dengan ukuran F4
		// Ukuran F4: 210mm x 297mm. Dalam inci: 8.27in x 11.7in
		let pdf = new jsPDF({
			orientation: "p",
			unit: "mm",
			format: [210, 297],
		});

		// Menambahkan gambar ke PDF
		pdf.addImage(data, "PNG", 0, 0, 210, 297);

		window.open(pdf.output("bloburl"), "_blank");
	};

	return (
		<>
			<div tw="border border-neutral-300">
				<div ref={printRef} style={{ width: "210mm", height: "297mm" }} tw="p-5 bg-white">
					{/* Konten yang ingin diubah menjadi PDF */}
					<h1>Contoh Dokumen</h1>
					<p>Ini adalah contoh dokumen yang akan diubah menjadi format PDF.</p>
				</div>
			</div>
			<button onClick={handlePrintPdf}>Print PDF</button>
		</>
	);
};
