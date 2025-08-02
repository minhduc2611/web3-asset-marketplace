"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowLeft, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner"
import authService from "@/lib/auth-service";
import Logo from "@/components/logo";
import Link from "next/link";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const result = await authService.forgotPassword({
        email: data.email,
        redirect_to: `${window.location.origin}/reset-password`,
      });

      if (!result.success) {
        toast.error("Failed to send reset email", {
          description: authService.handleAuthError(result),
        });
      } else {
        setSentEmail(data.email);
        setIsEmailSent(true);
        toast.success("Reset email sent", {
          description: "Please check your email for password reset instructions.",
        });
      }
    } catch {
      toast.error("Error", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!sentEmail) return;
    
    setIsLoading(true);
    try {
      const result = await authService.forgotPassword({
        email: sentEmail,
        redirect_to: `${window.location.origin}/reset-password`,
      });

      if (!result.success) {
        toast.error("Failed to resend email", {
          description: authService.handleAuthError(result),
        });
      } else {
        toast.success("Reset email resent", {
          description: "A new reset email has been sent to your inbox.",
        });
      }
    } catch {
      toast.error("Error", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Logo size="lg" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                {isEmailSent ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <Mail className="w-6 h-6 text-white" />
                )}
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {isEmailSent ? "Check Your Email" : "Forgot Password"}
            </CardTitle>
            <CardDescription>
              {isEmailSent
                ? `We've sent password reset instructions to ${sentEmail}`
                : "Enter your email address and we'll send you instructions to reset your password"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isEmailSent ? (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      className="pl-10 h-11 border-2 focus:border-green-500 transition-colors"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Reset Instructions
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="text-center space-y-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto"
                  >
                    <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </motion.div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    If an account with that email exists, you&apos;ll receive password reset instructions shortly.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Didn&apos;t receive the email? Check your spam folder or try again.
                  </p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleResendEmail}
                    variant="outline"
                    className="w-full h-11 border-2 border-green-200 hover:border-green-300 hover:bg-green-50 dark:border-green-800 dark:hover:border-green-700 dark:hover:bg-green-900 transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full"
                      />
                    ) : (
                      "Resend Email"
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center space-x-2"
            >
              <Link href="/login">
                <Button variant="link" className="px-0 text-green-600 hover:text-green-700 font-medium">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Sign In
                </Button>
              </Link>
            </motion.div>

            {!isEmailSent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-sm"
              >
                <span className="text-gray-600 dark:text-gray-400">
                  Don&apos;t have an account?{" "}
                </span>
                <Link href="/signup">
                  <Button variant="link" className="px-0 text-green-600 hover:text-green-700 font-medium">
                    Sign up
                  </Button>
                </Link>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}