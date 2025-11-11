import { SubscriptionManagement } from "@/components/tenant/billing/subscription-management";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerenciar Assinatura - LevelEDU Admin",
  description: "Gerencie sua assinatura do LevelEDU, visualize detalhes do plano e faça alterações.",
};

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Assinatura</h1>
        <p className="text-gray-600 mt-2">
          Gerencie sua assinatura e visualize detalhes do plano
        </p>
      </div>
      
      <SubscriptionManagement />
    </div>
  );
}