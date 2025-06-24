"use client";
import { stripePromise } from '@/lib/stripeClient';
import { useState } from 'react';

export default function UpgradePage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const res = await fetch('/api/checkout', { method: 'POST' });
    const data = await res.json();
    const stripe = await stripePromise;
    if (stripe && data.sessionId) {
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } else {
      alert('Stripe session failed.');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Upgrade to Premium</h1>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Redirecting...' : 'Upgrade Now'}
      </button>
    </div>
  );
} 