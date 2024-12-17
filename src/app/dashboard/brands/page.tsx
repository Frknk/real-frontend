import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query'

import { getBrands } from '@/commons/brands';
//import {CategoriesListTable} from './components/categories-list-table'
import { BrandsListTable } from './components/brands-list-table';

export default function Customers() {

    const queryClient = new QueryClient()

    queryClient.prefetchQuery({
        queryKey: ['brands'],
        queryFn: getBrands,
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <BrandsListTable />
        </HydrationBoundary>
    );
}