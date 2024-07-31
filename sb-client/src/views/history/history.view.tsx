import React from "react";
import { HistoryTable } from "./components";
import { useHistorySelector } from "./hooks";

export const HistoryView: React.FC = () => {
	useHistorySelector();

	return <HistoryTable />;
};
