import { usePdf } from "@libs/hooks";
import { ReturnResponse, useLazyGetReturnByIdQuery } from "@libs/redux";
import { convertRupiah } from "@libs/utils";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const useReturnDetailSelector = () => {
	const router = useRouter();
	const { generateAndOpenPdf } = usePdf();
	const params = useParams<{ returnId: string }>();
	const [getReturnById] = useLazyGetReturnByIdQuery();

	const [retur, setRetur] = useState<ReturnResponse>();

	const invoiceRef = useRef<HTMLDivElement>(null);

	const returItems = useMemo(
		() =>
			retur?.returnItem.map((item) => ({
				Nama: item.item.name,
				Qty: item.quantity,
				Harga: convertRupiah(item.returnPrice),
			})) || [],
		[retur]
	);

	const totalReturnPrice = useMemo(
		() => convertRupiah(retur?.returnItem.reduce((prev, curr) => prev + curr.returnPrice, 0) || 0),
		[retur]
	);

	const generateAndOpenPdfTab = useCallback(() => {
		generateAndOpenPdf(invoiceRef);
	}, [generateAndOpenPdf]);

	const fetchReturn = useCallback(() => {
		getReturnById({ id: params.returnId })
			.then((res) => setRetur(res.data))
			.catch(() => router.push("/return"));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.returnId]);

	useEffect(fetchReturn, [fetchReturn]);

	return {
		router,
		retur,
		returItems,
		totalReturnPrice,
		invoiceRef,
		generateAndOpenPdfTab,
	};
};
