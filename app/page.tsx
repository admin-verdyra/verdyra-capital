import Navbar from '../components/layout/Navbar';
import Hero from '../components/sections/Hero';
import TrustBar from '../components/sections/TrustBar';
import CapitalSolutions from '../components/sections/CapitalSolutions';
import WhyChooseVerdyra from '../components/sections/WhyChooseVerdyra';
import PartnersSection from '../components/sections/PartnersSection';
import EmiCalculator from '../components/sections/EmiCalculator';
import LendingNetwork from '../components/sections/LendingNetwork';
import AboutVerdyra from '../components/sections/AboutVerdyra';
import ContactSection from '../components/sections/ContactSection';
import Footer from '../components/sections/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <CapitalSolutions />
        <WhyChooseVerdyra />
        <PartnersSection />
        <EmiCalculator />
        <LendingNetwork />
        <AboutVerdyra />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}