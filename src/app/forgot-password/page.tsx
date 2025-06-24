import ForgotPassword from "@/components/pages/auth/forgot-password";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}