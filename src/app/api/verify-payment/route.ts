import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "No session ID provided" },
        { status: 400 }
      );
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Verify the session status
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Update the user's subscription status in your database
    // 2. Send a confirmation email
    // 3. Update any necessary user permissions/access
    
    // For now, we'll just return success
    return NextResponse.json({
      success: true,
      subscriptionId: session.subscription,
      customerId: session.customer,
      plan: session.metadata?.plan,
      isYearly: session.metadata?.isYearly === "true",
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Error verifying payment" },
      { status: 500 }
    );
  }
} 