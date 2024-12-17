import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query'

import { getCategories } from '@/commons/categories';
import {CategoriesListTable} from './components/categories-list-table'

export default function Customers() {

    const queryClient = new QueryClient()

    queryClient.prefetchQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <CategoriesListTable />
        </HydrationBoundary>
    );
}