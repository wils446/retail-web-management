"use client";
import React, { useRef } from "react";
import { AppStore, createStore, store } from "./store";
import { Provider } from "react-redux";

type StoreProviderProps = {
	children: React.ReactNode;
};
// store update
export const StoreProvider: React.FC<StoreProviderProps> = (props) => {
	// const storeRef = useRef<AppStore>();
	// if (!storeRef.current) {
	// 	storeRef.current = createStore();
	// }

	return <Provider store={store}>{props.children}</Provider>;
};
