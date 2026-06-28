import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'Disclaimer | Verdyra Capital',
  description: 'Disclaimer for Verdyra Capital.',
};

const sections = [
  {
    title: 'Informational Purpose Only',
    body:
      'The content on this website is intended for informational purposes only and does not constitute financial, legal, or investment advice. Any financing options or estimates presented are illustrative and subject to change.',
  },
  {
    title: 'No Guarantee of Approval',
    body:
      'Submitting an enquiry or completing a form does not guarantee approval, funding, or acceptance by any lender or financing partner. Final decisions are made separately by the relevant providers.',
  },
  {
    title: 'Third-Party Links',
    body:
      'Our website may contain links to third-party websites or services. Verdyra Capital is not responsible for the content, privacy practices, or accuracy of such external sites.',
  },
];

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-[#F8FAF9] text-[#111111]">
      <Navbar />
      <section className="px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-[#0F5A3A]/10 bg-white p-8 shadow-[0_24px_80px_rgba(15,90,58,0.08)] sm:p-10 lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F6B47]">
            Legal
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#111111] sm:text-4xl">
            Disclaimer
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
            The following disclaimer outlines the scope of the information and services provided by Verdyra Capital on this website.
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
