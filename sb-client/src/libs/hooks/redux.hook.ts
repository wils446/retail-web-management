import { AppDispatch, AppStore, RootState } from "@libs/redux";
import {
	TypedUseSelectorHook,
	useDispatch,
	useSelector,
	useStore,
} from "react-redux";

export const useAppStore: () => AppStore = useStore;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;
