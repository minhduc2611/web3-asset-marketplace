import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req: NextRequest) {
  // Next.js API routes: req.body is already a Buffer
  // For edge runtime, use req.arrayBuffer()
  return Buffer.from(await req.arrayBuffer());
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')!;
  const rawBody = await getRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }
    return NextResponse.json({ error: `Webhook Error: ${err}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      // Link subscription to Supabase user
      // Example: store session.customer, session.subscription, session.metadata.user_id
      console.log("session", session);
      break;
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      // Update subscription status in Supabase
      console.log("subscription", subscription);
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      console.log("subscription", subscription);
      // Mark subscription as canceled in Supabase
      break;
    }
    default:
      // Unexpected event type
      break;
  }

  return NextResponse.json({ received: true });
} 