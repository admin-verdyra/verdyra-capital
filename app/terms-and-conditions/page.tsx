import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service | Verdyra Capital',
  description: 'Terms of service for Verdyra Capital.',
};

const sections = [
  {
    title: 'Acceptance of Terms',
    body:
      'By accessing or using the Verdyra Capital website and related services, you agree to be bound by these Terms of Service. These terms govern your use of our digital platform, communications, and any information provided through our website.',
  },
  {
    title: 'Use of Information',
    body:
      'You agree to provide accurate information in any financing enquiry or application form. Verdyra Capital may use the information provided to assess your inquiry, provide advisory support, and connect you with appropriate lending partners in accordance with applicable law.',
  },
  {
    title: 'Confidentiality',
    body:
      'We will take reasonable measures to protect the confidentiality of your information. However, you acknowledge that internet-based communication may involve inherent security risks, and Verdyra Capital cannot guarantee absolute protection against unauthorized access.',
  },
  {
    title: 'Limitation of Liability',
    body:
      'Verdyra Capital shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the website or the services described herein, except where prohibited by law.',
  },
];

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-[#F8FAF9] text-[#111111]">
      <Navbar />
      <section className="px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-[#0F5A3A]/10 bg-white p-8 shadow-[0_24px_80px_rgba(15,90,58,0.08)] sm:p-10 lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F6B47]">
            Legal
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#111111] sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
            These Terms of Service outline the responsibilities and expectations governing your interaction with Verdyra Capital and our financing advisory services.
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
