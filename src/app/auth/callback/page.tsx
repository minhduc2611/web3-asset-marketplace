"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import authService from "@/lib/auth-service";

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get the full URL including fragment

        // Extract tokens from URL fragment
        const fragment = window.location.hash.substring(1); // Remove the #
        const params = new URLSearchParams(fragment);

        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        const error = params.get("error");
        const error_description = params.get("error_description");
        const type = params.get("type");

        console.log("🎯 >>>>>>>>> OAuth tokens:", { access_token, refresh_token, error });

        if (error) {
          console.error("OAuth error:", error, error_description);
          toast.error("OAuth login failed", {
            description:
              error_description || "An error occurred during OAuth login",
          });
          router.push("/login");
          return;
        }

        if (access_token) {
          // Verify the OAuth token with your backend
          const result = await authService.verifyOAuthToken({
            access_token,
            refresh_token: refresh_token || "",
            expires_at: Date.now() + 1000 * 60 * 60 * 24 * 15, // 15 days
            provider: "google",
          });

          if (type === "recovery") {
            router.push(`/reset-password`);
            return;
          } else {
            if (result.success && result.data) {
              toast.success("OAuth login successful!", {
                description: "You have been logged in successfully.",
              });
              // router.push('/');
              window.location.href = "/";
            } else {
              toast.error("OAuth verification failed", {
                description: authService.handleAuthError(result),
              });
              router.push("/login");
            }
          }
        } else {
          // Handle code-based OAuth flow
          const code = searchParams.get("code");
          if (code) {
            // TODO: Implement code exchange with your backend
            console.log("OAuth code received:", code);
            toast.info("OAuth code received", {
              description: "Processing OAuth login...",
            });
            // For now, redirect to login
            router.push("/login");
          } else {
            toast.error("No OAuth tokens found", {
              description: "OAuth callback did not provide required tokens",
            });
            router.push("/login");
          }
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        toast.error("OAuth callback failed", {
          description: "An unexpected error occurred during OAuth login",
        });
        router.push("/login");
      }
    };

    handleOAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing OAuth login...</p>
      </div>
    </div>
  );
}

export default function OAuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <OAuthCallbackContent />
    </Suspense>
  );
}
