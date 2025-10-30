import { HeroSection } from "./components/landing/core/HeroSection/HeroSection";
import { Benefits } from "./components/landing/core/Benefits/Benefits";
import { Process } from "./components/landing/core/Process/Process";
import { FAQ } from "./components/landing/core/FAQ/FAQ";
import { Footer } from "./components/landing/core/Footer/Footer";

export default function Home() {
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
