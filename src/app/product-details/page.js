// app/product-details/page.js
'use client';

import { Suspense } from 'react';
import ProductDetailsWrapper from './ProductDetailsWrapper';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading product...</div>}>
      <ProductDetailsWrapper />
    </Suspense>
  );
}
