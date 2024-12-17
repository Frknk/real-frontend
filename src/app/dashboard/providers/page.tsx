import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query'

import { getProviders } from '@/commons/providers';
import {ProvidersListTable} from './components/providers-list-table'

export default function Customers() {

    const queryClient = new QueryClient()

    queryClient.prefetchQuery({
        queryKey: ['providers'],
        queryFn: getProviders,
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProvidersListTable />
        </HydrationBoundary>
    );
}