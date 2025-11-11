import { Metadata } from "next";
import { redirect } from "next/navigation";
import SchoolSignupForm from "@/components/landing-page/school-signup-form";
import { getPlans } from "./actions";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

// SEO específico para página de signup
export const metadata: Metadata = generateSEOMetadata({
  title: "Criar conta - LevelEDU",
  description: "Cadastre sua escola no LevelEDU e comece a transformar a educação com gamificação. Processo simples e rápido para começar gratuitamente.",
  keywords: [
    'cadastro LevelEDU',
    'criar conta escola',
    'registro educacional',
    'teste grátis',
    'plataforma educacional'
  ]
});

interface SignupPageProps {
  searchParams: Promise<{
    plan?: string;
    trial?: string;
  }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const planId = params.plan;
  const trialDays = params.trial ? parseInt(params.trial) : undefined;

  if (!planId) {
    redirect('/#pricing');
  }

  try {
    // Buscar detalhes do plano
    const plans = await getPlans();
    const selectedPlan = plans.find(p => p.id === planId);

    if (!selectedPlan) {
      redirect('/#pricing');
    }

    return <SchoolSignupForm plan={selectedPlan} trialDays={trialDays} />;
  } catch (error) {
    redirect('/#pricing');
  }
}