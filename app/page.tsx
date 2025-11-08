import { CTASection } from "@/components/landing-page/cta-section";
import { FeaturesSection } from "@/components/landing-page/features-section";
import { Footer } from "@/components/landing-page/footer";
import { Header } from "@/components/landing-page/header";
import { HeroSection } from "@/components/landing-page/hero-section";
import { PhoneMockupSection } from "@/components/landing-page/phone-mockup-section";
import { PricingSection } from "@/components/landing-page/pricing-section";
import { StatsSection } from "@/components/landing-page/stats-section";


export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <PhoneMockupSection />
        <FeaturesSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
