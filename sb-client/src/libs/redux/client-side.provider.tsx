"use client";
import { StoreProvider } from "./provider";

export const ClientSideStoreProvider: React.FC<{ children: React.ReactNode }> = (props) => (
	<StoreProvider>{props.children}</StoreProvider>
);
