import ResetPassword from "@/components/pages/auth/reset-password";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your password",
};

export default function ResetPasswordPage() {
  return <ResetPassword />;
} 