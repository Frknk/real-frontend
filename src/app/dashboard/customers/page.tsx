import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query'

import { getCustomers } from '@/commons/customers';
import { CustomersListTable } from './components/customers-list-table';

export default function Customers() {

    const queryClient = new QueryClient()

    queryClient.prefetchQuery({
        queryKey: ['customers'],
        queryFn: getCustomers,
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <CustomersListTable />
        </HydrationBoundary>
    );
}