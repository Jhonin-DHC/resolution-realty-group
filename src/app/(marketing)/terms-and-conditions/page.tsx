import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions for Resolution Realty Group."
};

export default function TermsPage() {
  return (
    <section className="py-16">
      <div className="prose-rrg container-shell max-w-3xl">
        <h1 className="section-title">Terms and Conditions</h1>
        <p className="mt-4 text-sm text-[var(--body)]">Effective Date: 24/02/2022</p>
        <h2>1. Acceptance of Terms</h2>
        <p>By using this website, you agree to these terms. If you do not agree, please do not use the site.</p>
        <h2>2. Services Provided</h2>
        <p>
          Resolution Realty Group provides real estate information, listing marketing, and related services. Website
          content is for informational purposes and does not constitute a binding offer unless confirmed in writing.
        </p>
        <h2>3. User Responsibilities</h2>
        <p>You agree to provide accurate information when submitting inquiries and not to misuse the site.</p>
        <h2>4. Intellectual Property Rights</h2>
        <p>All site content, branding, and materials are owned by Resolution Realty Group or its licensors.</p>
        <h2>5. Third-Party Links</h2>
        <p>Links to third-party websites are provided for convenience and do not imply endorsement.</p>
        <h2>6. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, we are not liable for indirect or consequential damages arising from use
          of this website.
        </p>
        <h2>7. Privacy Policy</h2>
        <p>Your use of the site is also governed by our Privacy Policy.</p>
        <h2>8. Governing Law</h2>
        <p>These terms are governed by the laws of the State of Texas. Disputes shall be resolved in Fannin County, Texas.</p>
        <h2>9. Contact Information</h2>
        <p>
          {site.name}
          <br />
          {site.office}
          <br />
          {site.email}
          <br />
          {site.phone}
        </p>
      </div>
    </section>
  );
}
