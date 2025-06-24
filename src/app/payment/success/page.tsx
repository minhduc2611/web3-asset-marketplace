"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/components/logo";
import Link from "next/link";
import { toast } from "sonner";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        toast.error("No session ID found");
        router.push("/pricing");
        return;
      }

      try {
        const response = await fetch(`/api/verify-payment?session_id=${sessionId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to verify payment");
        }

        setIsSuccess(true);
        toast.success("Payment successful! Welcome to your new plan.");
      } catch (error) {
        console.error("Error verifying payment:", error);
        toast.error("Failed to verify payment. Please contact support.");
        router.push("/pricing");
      } finally {
        setIsVerifying(false);
      }
    };

    verifySession();
  }, [sessionId, router]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center text-white">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
          <h1 className="text-2xl font-semibold">Verifying your payment...</h1>
          <p className="text-slate-400">Please wait while we confirm your subscription</p>
        </div>
      </div>
    );
  }

  if (!isSuccess) {
    return null; // Will redirect to pricing page
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 px-6 py-6"
      >
        <div className="max-w-4xl mx-auto">
          <Logo showText size="md" />
        </div>
      </motion.header>

      {/* Success Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-white">
                    Payment Successful!
                  </h1>
                  <p className="text-slate-400">
                    Thank you for your subscription. Your account has been upgraded.
                  </p>
                </div>

                <div className="space-y-4">
                  <Link href="/canvas">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Go to Dashboard
                    </Button>
                  </Link>

                  <Link href="/pricing">
                    <Button variant="ghost" className="w-full text-slate-400 hover:text-white">
                      View Subscription Details
                    </Button>
                  </Link>
                </div>

                <p className="text-sm text-slate-500">
                  A confirmation email has been sent to your registered email address.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center text-white">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
        <h1 className="text-2xl font-semibold">Loading...</h1>
        <p className="text-slate-400">Please wait</p>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
} 