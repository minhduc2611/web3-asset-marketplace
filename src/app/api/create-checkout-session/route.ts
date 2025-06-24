import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";

type PlanType = "premium" | "diamond";

interface RequestBody {
  plan: PlanType;
  isYearly: boolean;
  userId: string;
}

export async function POST(req: Request) {
  try {
    const { plan, isYearly, userId } = (await req.json()) as RequestBody;

    // Get the price based on the plan and billing period
    const prices = {
      premium: {
        monthly: 999, // €9.99
        yearly: 9900, // €99.00
      },
      diamond: {
        monthly: 2499, // €24.99
        yearly: 24900, // €249.00
      },
    } as const;

    const price = isYearly ? prices[plan].yearly : prices[plan].monthly;
    const interval = isYearly ? "year" : "month";

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
              description: `${isYearly ? "Yearly" : "Monthly"} subscription`,
            },
            unit_amount: price,
            recurring: {
              interval: interval as "month" | "year",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?plan=${plan}&yearly=${isYearly}`,
      client_reference_id: userId,
      metadata: {
        plan,
        isYearly: isYearly.toString(),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
} 