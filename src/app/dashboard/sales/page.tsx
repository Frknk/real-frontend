import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query'

import { getSales } from '@/commons/sales';
import { SalesListTable } from './components/sales-list-table/sales-list-table';

export default function Sales() {

    const queryClient = new QueryClient()

    queryClient.prefetchQuery({
        queryKey: ['sales'],
        queryFn: getSales,
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SalesListTable />
        </HydrationBoundary>
    );
}