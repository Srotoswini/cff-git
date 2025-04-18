import { Suspense } from "react";
import CategoryWrapper from "./CategoryWrapper";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryWrapper />
    </Suspense>
  );
}
