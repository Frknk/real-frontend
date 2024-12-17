import { SalesDetail } from "../components/sales-detail"

export default async function Page({
    params,
  }: {
    params: Promise<{ slug: string }>
  }) {
    const slug = (await params).slug
    return <SalesDetail id={slug} />
}