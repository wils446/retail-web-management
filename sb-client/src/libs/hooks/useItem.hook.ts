import { GetItemsQuery, useLazyGetCategoriesQuery, useLazyGetItemsQuery } from "@libs/redux/api";

export const useItem = () => {
	const [getItemTrigger, { isFetching }] = useLazyGetItemsQuery();
	const [getCategoryTrigger] = useLazyGetCategoriesQuery();

	const getItem = (query?: GetItemsQuery) => {
		getItemTrigger(query ? query : undefined);
		getCategoryTrigger();
	};

	return { getItem, isFetching };
};
