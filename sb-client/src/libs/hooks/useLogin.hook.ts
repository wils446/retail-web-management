import { useLazyGetMeQuery, useLoginMutation } from "@libs/redux/api";
import { useRouter } from "next/navigation";

export const useLogin = () => {
	const router = useRouter();
	const [loginFn, { error, isLoading }] = useLoginMutation();
	const [getMe] = useLazyGetMeQuery();

	const login = async (username: string, password: string) => {
		const response = await loginFn({ password, username });
		if ("error" in response) return;
		await getMe();
		router.push("/app");
	};

	return { login, error, isLoading };
};
