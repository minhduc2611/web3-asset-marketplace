"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  Check,
  ArrowLeft,
  CreditCard,
  Shield,
  Lock,
  Crown,
  Gem,
  Zap,
  Calendar,
  Euro,
} from "lucide-react";
import Logo from "@/components/logo";
import useAppState from "@/store/useAppState";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const plans = {
  starter: {
    name: "Starter",
    icon: Zap,
    color: "blue",
    gradient: "from-blue-600 to-blue-700",
    bgGradient: "from-blue-900/40 to-blue-800/40",
    borderColor: "border-blue-600/30",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "2 canvases (max 70 nodes each)",
      "2 flashcard collections (up to 50 cards each)",
    ],
  },
  premium: {
    name: "Premium",
    icon: Crown,
    color: "purple",
    gradient: "from-purple-600 to-purple-700",
    bgGradient: "from-purple-900/40 to-purple-800/40",
    borderColor: "border-purple-600/30",
    monthlyPrice: 9.99,
    yearlyPrice: 99,
    features: [
      "All Starter features",
      "10 canvases (100 nodes each)",
      "10 flashcard collections (150 cards each)",
      "Access to all online course modules",
      "Email support",
    ],
  },
  diamond: {
    name: "Diamond",
    icon: Gem,
    color: "amber",
    gradient: "from-amber-600 to-amber-700",
    bgGradient: "from-amber-900/40 to-amber-800/40",
    borderColor: "border-amber-600/30",
    monthlyPrice: 24.99,
    yearlyPrice: 249,
    features: [
      "All Premium features",
      "Unlimited canvases & flashcard collections",
      "Early access to new courses & beta features",
      "Priority support (chat/video)",
      "Exclusive webinars & certificates",
    ],
  },
};

export default function Checkout() {
  const { user, appLoading } = useAppState();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isYearly, setIsYearly] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get plan and billing from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get("plan") || "";
    const yearly = urlParams.get("yearly") === "true";

    setSelectedPlan(plan.toLowerCase());
    setIsYearly(yearly);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!appLoading && !user) {
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
    }
  }, [user, appLoading, router]);

  // Show loading while checking auth
  if (appLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  // If no user after loading, component will redirect
  if (!user) {
    return null;
  }

  const plan = plans[selectedPlan as keyof typeof plans];

  if (!plan || selectedPlan === "starter") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">No Payment Required</h1>
          <p className="text-slate-400 mb-6">
            The Starter plan is completely free!
          </p>
          <Link href="/canvas">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Start Using MindGraph
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = plan.icon;
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const period = isYearly ? "year" : "month";
  const savings = isYearly
    ? Math.round(
        ((plan.monthlyPrice * 12 - plan.yearlyPrice) /
          (plan.monthlyPrice * 12)) *
          100
      )
    : 0;

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: selectedPlan,
          isYearly,
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Payment failed:", error);
      // You might want to show an error message to the user here
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 px-6 py-6"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/pricing">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Pricing
              </Button>
            </Link>
            <Logo showText size="md" />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Shield className="w-4 h-4" />
            Secure Checkout
          </div>
        </div>
      </motion.header>

      {/* Checkout Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Plan Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card
              className={`bg-gradient-to-br ${plan.bgGradient} ${plan.borderColor} backdrop-blur-sm`}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-3 bg-gradient-to-br ${plan.gradient} rounded-xl`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">
                      {plan.name} Plan
                    </CardTitle>
                    <p className="text-slate-400">
                      Perfect for growing learners
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">
                      €{price}
                    </span>
                    <span className="text-slate-400">/{period}</span>
                  </div>

                  {isYearly && savings > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600/20 text-green-300 border-green-600/30">
                        Save {savings}%
                      </Badge>
                      <span className="text-sm text-slate-400">
                        vs €{(plan.monthlyPrice * 12).toFixed(0)} monthly
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  What&apos;s Included
                </h4>

                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start gap-3"
                    >
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Complete Your Order
              </h2>
              <p className="text-slate-400">
                You&apos;re just one step away from unlocking premium features
              </p>
            </div>

            {/* Order Summary */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">
                    {plan.name} Plan ({period}ly)
                  </span>
                  <span className="text-white font-semibold">€{price}</span>
                </div>

                {isYearly && savings > 0 && (
                  <div className="flex justify-between items-center text-green-400">
                    <span>Yearly discount ({savings}%)</span>
                    <span>
                      -€{(plan.monthlyPrice * 12 - plan.yearlyPrice).toFixed(0)}
                    </span>
                  </div>
                )}

                <Separator className="bg-slate-700" />

                <div className="flex justify-between items-center text-lg font-semibold">
                  <span className="text-white">Total</span>
                  <div className="flex items-center gap-1">
                    <Euro className="w-4 h-4 text-white" />
                    <span className="text-white">{price}</span>
                    <span className="text-slate-400 text-sm">/{period}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400 mb-2">
                    Secure payment processing
                  </p>
                  <p className="text-sm text-slate-500">
                    Payment integration will be added here
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className={`w-full bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white font-medium py-6 text-lg`}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Complete Purchase - €{price}/{period}
                  </div>
                )}
              </Button>

              <p className="text-xs text-slate-500 text-center">
                By completing this purchase, you agree to our Terms of Service
                and Privacy Policy. Cancel anytime with no questions asked.
              </p>
            </div>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
              <Shield className="w-4 h-4" />
              <span>256-bit SSL encryption • Your data is secure</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
