import type { Metadata } from "next";
import { RemoteImage } from "@/components/remote-image";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet David Josh, MBA — licensed realtor with Resolution Realty Group, brokered by Central Metro Realty."
};

export default function TeamPage() {
  return (
    <section className="py-16">
      <div className="container-shell grid items-center gap-10 md:grid-cols-2">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl">
          <RemoteImage
            src="https://resolutionrealtygroup.com/wp-content/uploads/2025/03/David-Josh-Website-Photo.png"
            alt="David Josh, MBA"
            className="object-cover object-top"
          />
        </div>
        <div>
          <h1 className="section-title">Our Team</h1>
          <h2 className="mt-6 text-3xl">{site.agent}</h2>
          <p className="mt-3 text-[var(--body)]">Licensed Realtor, Resolution Realty Group</p>
          <p className="mt-1 text-[var(--body)]">{site.broker}</p>
        </div>
      </div>
    </section>
  );
}
