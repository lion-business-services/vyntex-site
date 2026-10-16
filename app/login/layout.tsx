import type { Metadata } from "next";

/** Private account screen: never indexed, never canonicalised to another page. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
