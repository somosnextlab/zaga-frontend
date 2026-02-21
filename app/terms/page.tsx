import { Suspense } from "react";
import TermsPageClient from "./TermsPageClient";

export default function TermsPage(): React.JSX.Element {
  return (
    <Suspense fallback={<div />}>
      <TermsPageClient />
    </Suspense>
  );
}