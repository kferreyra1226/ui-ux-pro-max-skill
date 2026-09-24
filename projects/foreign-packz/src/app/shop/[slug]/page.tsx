import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/commerce/ProductDetail';
import { AgeRequired } from '@/components/commerce/AgeRequired';
import { BRAND } from '@/lib/config';
import { getProductBySlug, PUBLIC_PRODUCTS } from '@/lib/mock/products';

export function generateStaticParams() {
  return PUBLIC_PRODUCTS.filter((p) => p.productClass !== 'apparel').map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return {
    title: product ? product.name : 'Product',
    description: product?.description,
  };
}

/**
 * Product detail for the cannabis menu.
 * Cannabis products render only after the visitor has confirmed being 21+.
 * Accessories on this route are not age restricted, but they still live behind the same
 * layout so the fulfilment rules stay in one place.
 */
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || product.productClass === 'apparel') notFound();

  if (product.productClass !== 'cannabis') {
    return <ProductDetail product={product} />;
  }

  return (
    <div className="pt-8">
      <AgeRequired
        title={`This product is for adults ${BRAND.minimumAge}+`}
        body="Confirm your age to view cannabis product details, potency information and lab documentation."
      >
        <ProductDetail product={product} />
      </AgeRequired>
    </div>
  );
}
