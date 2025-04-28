// app/product-details/page.js

export const dynamic = 'force-dynamic'; // Ensures this page is not statically prerendered

import { Suspense } from 'react';
import ProductDetailsWrapper from './ProductDetailsWrapper';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading product...</div>}>
      <ProductDetailsWrapper />
    </Suspense>
  );
}
