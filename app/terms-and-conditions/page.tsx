import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service | Verdyra Capital',
  description:
    'Terms of Service governing the use of Verdyra Capital operated by Verdyra Fintech Private Limited.',
};

const sections = [
  {
    title: 'Introduction',
    body:
      'These Terms of Service (“Terms”) govern your access to and use of the Verdyra Capital platform operated by Verdyra Fintech Private Limited, a company incorporated under the laws of India. By accessing the website, submitting an enquiry, or using any information, content, or services made available through the platform, you agree to be bound by these Terms.',
  },
  {
    title: 'Acceptance of Terms',
    body:
      'Your use of the website and any services provided through it constitutes your acceptance of these Terms in full. If you do not agree to these Terms, you must discontinue use of the platform immediately and refrain from submitting any enquiry or personal information.',
  },
  {
    title: 'Eligibility',
    body:
      'You represent and warrant that you are at least 18 years of age and have the legal capacity to enter into a binding contract. You further confirm that any information supplied by you is accurate, complete, and true to the best of your knowledge.',
  },
  {
    title: 'Scope of Services',
    body:
      'Verdyra Capital is a technology-enabled loan facilitation platform. Verdyra Capital is not a lender and does not sanction, approve, disburse, or extend loans. Financing solutions are offered solely by RBI-regulated Banks and NBFCs, and the final decision on eligibility, pricing, tenure, and disbursement rests solely with such lending partners.',
  },
  {
    title: 'Role of Verdyra Capital',
    body:
      'Verdyra Capital provides digital access to financing information, advisory support, and assistance in connecting users with potential lending partners. Verdyra Capital acts solely as an intermediary and does not assume any responsibility for the final credit decision or the contractual obligations between the user and any lender or financial institution.',
  },
  {
    title: 'Loan Application Process',
    body:
      'Submission of an enquiry through the website does not guarantee loan approval, sanction, disbursement, or acceptance. Interest rates, loan amounts, repayment tenures, and other terms are determined solely by the relevant lending partners based on their internal underwriting criteria and applicable regulatory requirements.',
  },
  {
    title: 'Use of Information',
    body:
      'You agree to provide accurate and current information in any enquiry, application, or document submitted through the platform. Any false, misleading, incomplete, or unauthorised information may result in rejection of the enquiry, denial of services, or reporting to appropriate authorities where required.',
  },
  {
    title: 'Consent to Share Information',
    body:
      'By submitting an enquiry, you expressly consent to the sharing of your information with lending partners, KYC providers, background verification agencies, and service providers solely for the purpose of processing, evaluating, and facilitating your financing enquiry. Such sharing shall be carried out in accordance with applicable law and the Privacy Policy.',
  },
  {
    title: 'User Responsibilities',
    body:
      'You agree to use the platform only for lawful purposes and not to misuse, alter, reverse engineer, distribute, or tamper with any content, systems, or services provided by Verdyra Capital. You shall be solely responsible for all activity conducted through your account or submitted enquiry.',
  },
  {
    title: 'Communications',
    body:
      'By submitting your contact details, you consent to receiving communications from Verdyra Capital and its lending partners regarding your enquiry, including calls, SMS, emails, or other electronic communications. You may opt out of certain promotional communications in accordance with applicable law and the communication preferences provided by us.',
  },
  {
    title: 'Confidentiality',
    body:
      'Verdyra Capital shall use commercially reasonable efforts to protect the confidentiality of the information shared with it. However, no system of electronic transmission or storage is entirely secure, and Verdyra Capital cannot guarantee absolute confidentiality or protection against unauthorised access, loss, or disclosure.',
  },
  {
    title: 'Intellectual Property',
    body:
      'All content, design, trademarks, logos, branding, text, graphics, images, software, and other materials appearing on the website belong to or are licensed to Verdyra Fintech Private Limited. You may not copy, reproduce, modify, display, distribute, or commercially exploit such materials without prior written permission from Verdyra Fintech Private Limited.',
  },
  {
    title: 'Third Party Services',
    body:
      'The platform may contain links or integrations to third-party service providers, financial institutions, or other websites. Verdyra Capital does not control and is not responsible for the content, privacy practices, or terms of such third-party services, and your use of them is at your own risk.',
  },
  {
    title: 'Disclaimer',
    body:
      'The content on this website is provided for informational purposes only and does not constitute financial, legal, tax, accounting, or investment advice. While Verdyra Capital strives to ensure accuracy, it does not guarantee that the website will be error-free, uninterrupted, or suitable for your specific requirements.',
  },
  {
    title: 'Limitation of Liability',
    body:
      'To the maximum extent permitted by applicable law, Verdyra Capital and its directors, officers, employees, representatives, and affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the website or any financing enquiry submitted through the platform.',
  },
  {
    title: 'Indemnity',
    body:
      'You agree to indemnify and hold harmless Verdyra Capital, its affiliates, and their respective officers, employees, and representatives from any claims, liabilities, losses, damages, or expenses arising out of your misuse of the platform, inaccurate information supplied by you, or violation of these Terms.',
  },
  {
    title: 'Changes to Terms',
    body:
      'Verdyra Capital reserves the right to revise, update, or modify these Terms at any time without prior notice. Continued use of the platform after such changes shall constitute your acceptance of the revised Terms. It is your responsibility to review these Terms periodically.',
  },
  {
    title: 'Governing Law',
    body:
      'These Terms shall be governed by and construed in accordance with the laws of India. The courts at Gurugram, Haryana shall have exclusive jurisdiction over any disputes arising out of or in connection with these Terms or your use of the website.',
  },
  {
    title: 'Grievance Redressal',
    body: `User Support

We are committed to resolving any concerns, complaints or grievances relating to your use of the Verdyra Capital platform or the services facilitated through it. If you have any questions, concerns or complaints regarding our services, you may contact us through the communication channels available on our Platform.

Grievance Redressal Officer

Verdyra Fintech Private Limited has appointed a Grievance Redressal Officer to address complaints relating to our platform and the services facilitated through it.

Name: Mr. Puneet Aggarwal

Email: connect@verdyracapital.in

We aim to acknowledge and resolve all genuine grievances within a reasonable timeframe in accordance with applicable laws and industry best practices.`,
  },
  {
    title: 'Contact Information',
    body:
      'Verdyra Fintech Private Limited operates the brand Verdyra Capital. Its registered office is A100 First Floor, Block A, Sushant Lok Phase – 3, Gurugram – 122003, Haryana, India. For any queries, please contact us at connect@verdyracapital.in.',
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
            These Terms of Service govern your access to and use of the Verdyra Capital platform operated by Verdyra Fintech Private Limited.
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
