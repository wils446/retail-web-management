import { api } from ".";

export type CategoryResponse = {
	id: string;
	created_at: Date;
	updated_at: Date;
	name: string;
};

type GetCategoriesResponse = {
	count: number;
	categories: CategoryResponse[];
};

type CreateCategoryMutation = {
	name: string;
};

type DeleteCategoryMutation = {
	id: string;
};

type UpdateCategoryMutation = {
	id: string;
	name: string;
};

type DeleteCategoryResponse = {
	message: string;
};

export const categoryApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getCategories: builder.query<GetCategoriesResponse, void>({
			query: () => "/category",
		}),
		createCategory: builder.mutation<CategoryResponse, CreateCategoryMutation>({
			query: ({ name }) => ({
				url: "/category",
				method: "POST",
				body: { name },
			}),
		}),
		deleteCategory: builder.mutation<DeleteCategoryResponse, DeleteCategoryMutation>({
			query: ({ id }) => ({
				url: `/category/${id}`,
				method: "DELETE",
			}),
		}),
		updateCategory: builder.mutation<CategoryResponse, UpdateCategoryMutation>({
			query: ({ name, id }) => ({
				url: `/category/${id}`,
				method: "PATCH",
				body: { name },
			}),
		}),
	}),
});

export const {
	useCreateCategoryMutation,
	useUpdateCategoryMutation,
	useDeleteCategoryMutation,
	useGetCategoriesQuery,
	useLazyGetCategoriesQuery,
} = categoryApi;
