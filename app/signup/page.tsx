import { redirect } from "next/navigation";
import SchoolSignupForm from "@/components/landing-page/school-signup-form";
import { getPlans } from "./actions";

interface SignupPageProps {
  searchParams: Promise<{
    plan?: string;
  }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const planId = params.plan;

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

    return <SchoolSignupForm plan={selectedPlan} />;
  } catch (error) {
    redirect('/#pricing');
  }
}