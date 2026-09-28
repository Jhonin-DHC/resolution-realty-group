import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { JsonLd } from "@/components/json-ld";
import { localBusinessJsonLd } from "@/lib/seo";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
