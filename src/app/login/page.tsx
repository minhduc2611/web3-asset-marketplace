"use client";
import { Icons } from "@/components/common/icons";
import superbaseInstance from "@/services/instances/superbaseInstance";
import { useClientAuthStore } from "@/stores/authentication";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = () => {
  const pathname = usePathname();
  const { isLoading, user, signUp, signInWithPassword } = useClientAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSignIn, setIsSignIn] = useState(true);
  const [message, setMessage] = useState({
    content: "",
    type: "", // success, error
  });
  const router = useRouter();

  const handleSignUp = async () => {
    const err = validateSignUp();
    if (err) {
      setMessage({
        content: err,
        type: "error",
      });
      return;
    }
    try {
      await signUp({ email, password });
      setMessage({
        content: "Account created successfully. Please check your email.",
        type: "success",
      });
    } catch (error) {
      setMessage({
        content: "Error signing up. Please try again.",
        type: "error",
      });
    }
  };

  const validateSignUp = () => {
    if (!email) {
      return "Email is required";
    }
    if (!password) {
      return "Password is required";
    }
    if (password !== passwordConfirm) {
      return "Passwords do not match";
    }
    return null;
  };

  const validateSignIn = () => {
    if (!email) {
      return "Email is required";
    }
    if (!password) {
      return "Password is required";
    }
    return null;
  };

  const signUpErr = validateSignUp();
  const signInErr = validateSignIn();

  const handleSignIn = async () => {
    try {
      await signInWithPassword({
        email,
        password,
      });
      router.refresh();
      redirect("/");
    } catch (error) {
      setMessage({
        content: "Error signing in. Credentials are incorrect.",
        type: "error",
      });
    }
  };

  const loginWithGithub = async () => {
    console.log("login with github", process.env.NEXT_PUBLIC_BASE_URL, pathname);
    await superbaseInstance.getInstance().auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback?next=${pathname}`,
      },
    });
  };

  const loginWithGoogle = async () => {
    console.log("login with google", process.env.NEXT_PUBLIC_BASE_URL, pathname);
    await superbaseInstance.getInstance().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback?next=${pathname}`,
      },
    });
  };

  if (user) {
    router.push("/");
    return <h1>loading..</h1>;
  }

  return (
    <main className="h-full flex items-center justify-center bg-gray-800 p-6">
      <div className="bg-gray-900 p-8 rounded-lg shadow-md w-96">
        {message.type == "error" && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-4">
            {message.content}
          </div>
        )}
        {message.type == "success" && (
          <div className="bg-green-500 text-white p-3 rounded-md mb-4">
            {message.content}
          </div>
        )}
        <input
          type="email"
          name="mk-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="mb-4 w-full p-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <input
          type="password"
          name="mk-email"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mb-4 w-full p-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />

        {!isSignIn && (
          <input
            type="password"
            name="mk-password-confirm"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="Confirm Password"
            className="mb-4 w-full p-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        )}
        {isSignIn ? (
          <button
            type="button"
            onClick={handleSignIn}
            disabled={!!signInErr}
            className="w-full p-3 rounded-md bg-gray-700 text-white hover:bg-gray-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign In
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSignUp}
            disabled={!!signUpErr}
            className="w-full p-3 rounded-md bg-gray-700 text-white hover:bg-gray-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign Up
          </button>
        )}

        <div className="text-center my-2 text-gray-200">
          <span
            onClick={() => setIsSignIn(!isSignIn)}
            className="w-full cursor-pointer hover:underline"
          >
            {isSignIn ? "Don't have an account?" : "Already have an account?"}
          </span>
        </div>
        <div className="text-center my-3 text-gray-200">
          <p>or</p>
          <p>Sign in with</p>
        </div>
        <div className="flex justify-between gap-3">
          <button
            type="button"
            onClick={loginWithGithub}
            className="w-full flex justify-start gap-4 items-center p-3 rounded-md bg-gray-700 text-white hover:bg-gray-600 focus:outline-none"
          >
            <Icons.gitHub className="h-10" />
            <span>Github</span>
          </button>
          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full flex justify-start gap-4 items-center p-3 rounded-md bg-gray-700 text-white hover:bg-gray-600 focus:outline-none"
          >
            <Icons.google className="h-10" />
            <span>Google</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
