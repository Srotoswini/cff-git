'use client';

import { useSearchParams } from 'next/navigation';
import ProductDetails from '@/components/ProductDetails';

export default function ProductDetailsWrapper() {
  const searchParams = useSearchParams();
  const data = searchParams.get('data');

  let product = null;
  try {
    product = JSON.parse(decodeURIComponent(data));
  } catch (error) {
    console.error('Invalid product data:', error);
    return <div>Error loading product data.</div>;
  }

  return <ProductDetails product={product} />;
}
