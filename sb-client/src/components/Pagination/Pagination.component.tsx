"use client";
import { Icon, Input } from "@components";
import { useQueryString } from "@libs/hooks";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import tw from "twin.macro";

type PaginationProps = {
	totalPage: number;
};

const PaginationButton = tw.button`w-8 h-8 2xl:w-9 2xl:h-9 border-2 flex items-center justify-center border-indigo-300 rounded text-sm xl:text-base hover:(bg-indigo-200)  disabled:(bg-indigo-300 cursor-default text-white)`;

export const Pagination: React.FC<PaginationProps> = (props) => {
	const { searchParams, updateQueryUrl } = useQueryString();
	const [inputPageValue, setInputPageValue] = useState<number>();
	const [inputPageMode, setInputPageMode] = useState(false);

	const currentPage = useMemo(() => +(searchParams.get("page") || 1), [searchParams]);
	const updatePage = useCallback(
		(page: number) => updateQueryUrl("page", page > 1 ? "" + page : ""),
		[updateQueryUrl]
	);

	const showInputPage = useMemo(() => {
		if (props.totalPage <= 5) return false;
		if (props.totalPage === 6 && currentPage + 1 === 6) return false;

		return true;
	}, [props.totalPage, currentPage]);

	useEffect(() => {
		if (currentPage > props.totalPage) updatePage(props.totalPage);
	}, [props.totalPage, updatePage, currentPage]);

	return (
		<div tw="py-5 flex justify-center space-x-2 items-center">
			<PaginationButton disabled={currentPage === 1} onClick={() => updatePage(currentPage - 1)}>
				<Icon icon="leftArrow" size="lg" />
			</PaginationButton>
			{Array.from({ length: props.totalPage > 5 ? 5 : props.totalPage }).map((_, i) => (
				<PaginationButton
					disabled={currentPage === i + 1}
					onClick={() => updatePage(i + 1)}
					key={i}
				>
					{i + 1}
				</PaginationButton>
			))}
			{showInputPage &&
				(inputPageMode ? (
					<Input
						label=""
						type="number"
						extraInputStyle={tw`w-9 h-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
						onChange={(e) => setInputPageValue(+e.target.value)}
						onKeyDown={(e) => {
							if (e.code !== "Enter" || !inputPageValue) return;
							if (inputPageValue > props.totalPage) return;
							updatePage(inputPageValue);
							setInputPageMode(false);
						}}
					/>
				) : (
					<PaginationButton onClick={() => setInputPageMode(true)}>...</PaginationButton>
				))}

			{currentPage + 1 > 5 && <PaginationButton disabled>{currentPage}</PaginationButton>}

			<PaginationButton
				disabled={currentPage === props.totalPage}
				onClick={() => updatePage(currentPage + 1)}
			>
				<Icon icon="rightArrow" size="lg" />
			</PaginationButton>
		</div>
	);
};
