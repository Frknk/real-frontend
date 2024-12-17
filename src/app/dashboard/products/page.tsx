import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
  } from '@tanstack/react-query'

import { ProductListTable } from './components/product-list-table/product-table'
import { getProducts } from '@/commons/products'
import { getBrands } from '@/commons/brands'
import { getCategories } from '@/commons/categories'
import { getProviders } from '@/commons/providers'

export default async function ProductsPage() {

    const queryClient = new QueryClient()

    await queryClient.prefetchQuery({
      queryKey: ['products'],
      queryFn: getProducts,
    })
    await queryClient.prefetchQuery({
      queryKey: ['brands'],
      queryFn: getBrands,
    })
    await queryClient.prefetchQuery({
      queryKey: ['categories'],
      queryFn: getCategories,
    })
    await queryClient.prefetchQuery({
      queryKey: ['providers'],
      queryFn: getProviders,
    })


    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductListTable />
        </HydrationBoundary>
    );
}