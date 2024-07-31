import { usePdf } from "@libs/hooks";
import { OrderResponse, useLazyGetOrderByIdQuery } from "@libs/redux";
import { convertRupiah } from "@libs/utils";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const useOrderDetailSelector = () => {
	const router = useRouter();
	const pathname = usePathname();
	const { generateAndOpenPdf } = usePdf();
	const params = useParams<{ orderId: string }>();
	const [getOrderById] = useLazyGetOrderByIdQuery();

	const [order, setOrder] = useState<OrderResponse>();

	const invoiceRef = useRef<HTMLDivElement>(null);

	const orderItems = useMemo(
		() =>
			order?.items.map((item) => ({
				Nama: item.name,
				Qty: item.quantity,
				Harga: convertRupiah(item.cost),
			})) || [],
		[order]
	);

	const totalPrice = useMemo(
		() => convertRupiah(order?.items.reduce((prev, curr) => prev + curr.cost, 0) || 0),
		[order?.items]
	);

	const paidStatus = useMemo(() => (order?.paid ? "lunas" : "belum lunas"), [order?.paid]);

	const isReturButtonDisabled = useMemo(() => !!order?.return, [order?.return]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const goToCreateRetur = useCallback(() => router.push(`${pathname}/return`), [pathname]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const goToPrevPage = useCallback(() => router.back(), [pathname]);

	const goToReturPage = useCallback(
		() => router.push(`/app/return/${order?.return?.id}`),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[order?.return?.id]
	);

	const generateAndOpenPdfTab = useCallback(() => {
		generateAndOpenPdf(invoiceRef);
	}, [generateAndOpenPdf]);

	const fetchOrder = useCallback(() => {
		getOrderById({ id: params.orderId })
			.then((res) => setOrder(res.data))
			.catch(() => goToPrevPage());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.orderId]);

	console.log(order);

	useEffect(fetchOrder, [fetchOrder]);

	return {
		order,
		orderItems,
		goToCreateRetur,
		goToPrevPage,
		totalPrice,
		isReturButtonDisabled,
		goToReturPage,
		paidStatus,
		invoiceRef,
		generateAndOpenPdfTab,
	};
};
