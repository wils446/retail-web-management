import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Id, toast } from "react-toastify";

type PromiseResponse =
	| {
			data: any;
	  }
	| {
			error: FetchBaseQueryError | SerializedError;
	  };

export const usePromiseToast = () => {
	let toastId: Id;

	const startLoading = () => {
		toastId = toast.loading("Loading...");
	};

	const endLoading = (
		response: PromiseResponse,
		successMessage: string,
		failedMessage?: string
	) => {
		toast.update(toastId, {
			render:
				"error" in response
					? failedMessage
						? failedMessage
						: "Terjadi kesalahan, coba ulangi lagi"
					: successMessage,
			type: "error" in response ? "error" : "success",
			isLoading: false,
			autoClose: 2000,
		});
	};

	return { startLoading, endLoading };
};
