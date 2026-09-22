import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/commerce/ProductDetail';
import { getProductBySlug, PUBLIC_PRODUCTS } from '@/lib/mock/products';

export function generateStaticParams() {
  return PUBLIC_PRODUCTS.filter((p) => p.productClass === 'apparel').map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return { title: product ? product.name : 'Apparel', description: product?.description };
}

/** Apparel detail. No age gate and no cannabis content on this route. */
export default async function ApparelProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || product.productClass !== 'apparel') notFound();
  return <ProductDetail product={product} />;
}
