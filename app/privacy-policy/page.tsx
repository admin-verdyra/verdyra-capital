import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | Verdyra Capital',
  description: 'Privacy policy for Verdyra Capital.',
};

const sections = [
  {
    title: 'Information We Collect',
    body:
      'We collect information that you provide through enquiry forms, including your business name, contact details, financial information, and other relevant data required to assess your financing requirements.',
  },
  {
    title: 'How We Use Your Information',
    body:
      'Your information may be used to respond to your enquiry, evaluate potential financing options, coordinate with lending partners, and improve our advisory services. We may contact you using the contact details you have provided.',
  },
  {
    title: 'Data Security',
    body:
      'We use commercially reasonable safeguards to secure your information. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute protection.',
  },
  {
    title: 'Your Rights',
    body:
      'You may request access to, correction of, or deletion of your personal information by contacting us at connect@verdyracapital.in. We will address such requests in accordance with applicable laws and regulations.',
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
            This Privacy Policy explains how Verdyra Capital collects, uses, shares, and protects your information when you use our website or submit an enquiry.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-[#F8FAF9] p-5 sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#B8860B]">
              Last Updated
            </p>
            <p className="mt-2 text-sm text-slate-600">28 June 2026</p>
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
