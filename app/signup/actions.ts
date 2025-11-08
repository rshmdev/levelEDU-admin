import { SubscriptionPlan } from "@/lib/stripe-client";

export async function getPlans(): Promise<SubscriptionPlan[]> {
    // Use fetch for public endpoints (no auth needed)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscriptions/plans`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
}