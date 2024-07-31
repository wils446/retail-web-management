import { useAppSelector, usePdf } from "@libs/hooks";
import { TransactionResponse, useLazyGetTransactionByIdQuery } from "@libs/redux";
import { convertRupiah } from "@libs/utils";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const useTransactionDetailSelector = () => {
	const pathname = usePathname();
	const router = useRouter();
	const [getTransactionById] = useLazyGetTransactionByIdQuery();
	const { generateAndOpenPdf } = usePdf();
	const params = useParams<{ transactionId: string }>();

	const [transaction, setTransaction] = useState<TransactionResponse>();

	const invoiceRef = useRef<HTMLDivElement>(null);

	const transactionItem = useMemo(
		() =>
			transaction?.items.map((item) => ({
				Nama: item.name,
				Qty: item.quantity,
				Harga: convertRupiah(item.price),
			})) || [],
		[transaction]
	);

	const totalPrice = useMemo(
		() => transaction?.items.reduce((prev, curr) => prev + curr.price, 0) || 0,
		[transaction]
	);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const goToCreateRetur = useCallback(() => router.push(`${pathname}/return`), [pathname]);

	const goToReturPage = useCallback(
		() => router.push(`/app/return/${transaction?.return.id}`),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[transaction?.return]
	);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const goToPrevPage = useCallback(() => router.back(), []);

	const generateAndOpenPdfTab = useCallback(() => {
		generateAndOpenPdf(invoiceRef);
	}, [generateAndOpenPdf]);

	const returStats = useMemo(() => !!transaction?.return, [transaction?.return]);

	const fetchTransaction = useCallback(() => {
		getTransactionById({ id: params.transactionId })
			.then((res) => setTransaction(res.data))
			.catch(() => router.back());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.transactionId]);

	useEffect(fetchTransaction, [fetchTransaction]);

	return {
		transaction,
		transactionItem,
		totalPrice,
		goToReturPage,
		returStats,
		goToCreateRetur,
		goToPrevPage,
		generateAndOpenPdfTab,
		invoiceRef,
	};
};
