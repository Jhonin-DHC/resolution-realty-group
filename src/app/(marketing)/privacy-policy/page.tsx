import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Resolution Realty Group."
};

export default function PrivacyPage() {
  return (
    <section className="py-16">
      <div className="prose-rrg container-shell max-w-3xl">
        <h1 className="section-title">Privacy Policy</h1>
        <p className="mt-4 text-sm text-[var(--body)]">Effective Date: 24/02/2022</p>
        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide through inquiry forms, phone, email, and valuation requests, including your
          name, email, phone number, property address, and message details.
        </p>
        <h2>2. Use of Information</h2>
        <p>
          We use this information to respond to inquiries, provide real estate services, send requested valuations or cash
          offers, and improve our website.
        </p>
        <h2>3. A2P 10DLC Messaging Compliance</h2>
        <p>
          If you opt in to SMS communications, we may send transactional messages related to your inquiry. Message and data
          rates may apply. You can opt out at any time by replying STOP.
        </p>
        <h2>4. Sharing Your Information</h2>
        <p>
          We do not sell your personal information. We may share it with service providers who help us operate our business
          (such as email delivery) or when required by law.
        </p>
        <h2>5. Security</h2>
        <p>We take reasonable measures to protect personal information from unauthorized access, use, or disclosure.</p>
        <h2>6. Your Rights and Choices</h2>
        <p>You may request access, correction, or deletion of your personal information by contacting us.</p>
        <h2>7. Cookies and Tracking Technologies</h2>
        <p>Our site may use cookies and similar technologies to understand site usage and improve your experience.</p>
        <h2>8. Third-Party Links</h2>
        <p>Our website may contain links to third-party sites. We are not responsible for their privacy practices.</p>
        <h2>9. Children’s Privacy</h2>
        <p>Our services are not directed to children under 13, and we do not knowingly collect their information.</p>
        <h2>10. Changes</h2>
        <p>We may update this policy from time to time. The updated version will be posted on this page.</p>
        <h2>11. Contact Us</h2>
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
