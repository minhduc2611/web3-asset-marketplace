import { NextRequest, NextResponse } from 'next/server';
import { buffer } from 'micro';
import stripe from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

export const config = {
  api: {
    bodyParser: false,
  },
};

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      // Link subscription to Supabase user
      // Example: store session.customer, session.subscription, session.metadata.user_id
      break;
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      // Update subscription status in Supabase
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      // Mark subscription as canceled in Supabase
      break;
    }
    default:
      // Unexpected event type
      break;
  }

  return NextResponse.json({ received: true });
} 