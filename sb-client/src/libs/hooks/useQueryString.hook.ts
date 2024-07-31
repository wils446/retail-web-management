import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useQueryString = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const createQueryString = useCallback(
		(key: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(key, value);

			return params.toString();
		},
		[searchParams]
	);

	const updateQueryUrl = useCallback(
		(key: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			if (value) params.set(key, value);
			else params.delete(key);

			router.push(pathname + "?" + params.toString());
		},
		[searchParams, pathname, router]
	);

	return { createQueryString, searchParams, updateQueryUrl };
};
