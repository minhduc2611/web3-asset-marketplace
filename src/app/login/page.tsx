import Login from "@/components/pages/auth/login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login",
};

export default function LoginPage() {
  return <Login />;
}