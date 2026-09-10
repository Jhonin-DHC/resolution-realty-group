import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--coral)]">404</p>
        <h1 className="mt-3 text-4xl">Page not found</h1>
        <p className="mt-3 max-w-md text-[var(--body)]">The page you requested is not available. Let’s get you back home.</p>
        <Link href="/" className="btn-coral mt-8">
          Back to Home
        </Link>
      </div>
      <Footer />
    </>
  );
}
