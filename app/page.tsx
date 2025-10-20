import type { Metadata } from 'next';
import { HeroSection } from '@/components/core/HeroSection/HeroSection';
import { Benefits } from '@/components/core/Benefits/Benefits';
import { Process } from '@/components/core/Process/Process';
import { FAQ } from '@/components/core/FAQ/FAQ';
import { Footer } from './components/core/Footer/Footer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Zaga — Préstamos personales rápidos y seguros',
  description:
    'Obtén el préstamo personal que necesitas en minutos. Proceso 100% digital, transparente y con las mejores tasas del mercado.',
};

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <Benefits />
      <Process />
      <FAQ />
      <Footer />
    </>
  );
}
