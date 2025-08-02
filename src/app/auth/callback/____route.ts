import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");
  const next = searchParams.get("next") ?? "/";

  console.log("🎯 >>>>>>>>> Server callback, request url:", request.url);
  console.log("🎯 >>>>>>>>> Server callback, code:", code);
  console.log("🎯 >>>>>>>>> Server callback, error:", error);

  // If there's an error from OAuth provider
  if (error) {
    console.error("OAuth error:", error, error_description);
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${error}&description=${error_description}`);
  }

  // If we have a code, redirect to client-side handler
  if (code) {
    return NextResponse.redirect(`${origin}/auth/callback/client?code=${code}&next=${next}`);
  }

  // No valid parameters - redirect to client-side handler to check for fragments
  // return NextResponse.redirect(`${origin}/auth/callback/client`);
} 