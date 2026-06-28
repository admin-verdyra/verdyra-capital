import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | Verdyra Capital',
  description:
    'Privacy Policy governing the collection, use and protection of personal information by Verdyra Fintech Private Limited.',
};

const sections = [
  {
    title: 'Introduction',
    body:
      'This Privacy Policy explains how Verdyra Capital, operated by Verdyra Fintech Private Limited, collects, uses, stores, shares and protects your personal information when you access our website, submit an enquiry or use our services. Verdyra Capital is a technology-enabled loan facilitation platform and is not a lender. We facilitate access to financing solutions offered by RBI-regulated Banks and NBFCs.',
  },
  {
    title: 'Information We Collect',
    body:
      'We collect information that you submit through enquiry forms and related interactions, including business details, contact information, funding requirements, supporting documents, financial information, and other data reasonably necessary to assess your financing request. We may also collect information automatically through cookies, analytics tools, and website usage data.',
  },
  {
    title: 'How We Use Your Information',
    body:
      'We use the information collected to respond to your enquiry, evaluate financing requirements, connect you with suitable lending partners, assist with KYC and verification processes, improve our platform and services, and communicate with you regarding your request. We may also use your information to comply with legal obligations and manage our internal business operations.',
  },
  {
    title: 'Information Sharing',
    body:
      'We may share your information with lending partners, KYC providers, verification agencies, technology providers, service providers, and other third parties only for the purpose of processing, reviewing, or facilitating your financing enquiry. We do not sell or rent your personal information to third parties for marketing purposes.',
  },
  {
    title: 'Lending Partners',
    body:
      'Where appropriate, we may share your information with RBI-regulated banks and NBFCs that may evaluate your request and offer financing products. The final decision on eligibility, pricing, terms, and disbursement rests solely with such lending partners and is governed by their own policies and applicable law.',
  },
  {
    title: 'Cookies and Analytics',
    body:
      'Our website may use cookies, pixels, and similar technologies to provide website functionality, analyse traffic, improve user experience, and measure performance. These technologies may collect information such as IP address, browser type, device information, and usage patterns. You may manage your preferences through your browser settings, although some features of the website may be affected.',
  },
  {
    title: 'Data Security',
    body:
      'We use commercially reasonable administrative, technical, and physical safeguards to protect personal information against unauthorised access, loss, misuse, alteration, or disclosure. However, no electronic storage or transmission system is completely secure, and we cannot guarantee absolute protection against all risks.',
  },
  {
    title: 'Data Retention',
    body:
      'We retain personal information for as long as necessary to fulfil the purposes described in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce our agreements. When information is no longer required, it will be deleted, anonymised, or securely stored in accordance with applicable law.',
  },
  {
    title: 'Your Rights',
    body:
      'You may request access to, correction of, or deletion of your personal information by emailing connect@verdyracapital.in. We may need to verify your identity before acting on such a request and may deny or limit a request where permitted by applicable law.',
  },
  {
    title: 'Third-Party Websites',
    body:
      'Our website may contain links to third-party websites, platforms, or services. These third-party websites are governed by their own privacy policies and terms, and Verdyra Capital is not responsible for their data practices or content.',
  },
  {
    title: 'Children\'s Privacy',
    body:
      'Our services are not intended for children under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information without appropriate consent, we will take steps to delete such information promptly.',
  },
  {
    title: 'Changes to this Privacy Policy',
    body:
      'We may update this Privacy Policy from time to time to reflect changes in law, business operations, or service offerings. Any revised version will be effective from the date of publication and will include a revised Last Updated date.',
  },
  {
    title: 'Grievance Redressal',
    body: `User Support

We are committed to resolving concerns relating to the collection, processing or use of personal information. If you have any complaint, concern, or grievance regarding our privacy practices, you may contact us using the details provided below.

Grievance Redressal Officer

Name: Mr. Puneet Aggarwal

Email: connect@verdyracapital.in`,
  },
  {
    title: 'Contact Information',
    body:
      'Verdyra Fintech Private Limited operates the brand Verdyra Capital. Its registered office is A100 First Floor, Block A, Sushant Lok Phase – 3, Gurugram – 122003, Haryana, India. For any privacy-related queries or requests, please email connect@verdyracapital.in.',
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#F8FAF9] text-[#111111]">
      <Navbar />
      <section className="px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-[#0F5A3A]/10 bg-white p-8 shadow-[0_24px_80px_rgba(15,90,58,0.08)] sm:p-10 lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F6B47]">
            Legal
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#111111] sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
            This Privacy Policy explains how Verdyra Capital, operated by Verdyra Fintech Private Limited, collects, uses, stores, shares and protects your personal information when you access our website or use our services.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-[#F8FAF9] p-5 sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#B8860B]">
              Version 1.0
            </p>
            <p className="mt-2 text-sm text-slate-600">Last Updated: 28 June 2026</p>
          </div>

          <div className="mt-10 space-y-8">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-semibold text-[#111111]">{section.title}</h2>
                <p className="mt-3 text-base leading-8 text-slate-600">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
