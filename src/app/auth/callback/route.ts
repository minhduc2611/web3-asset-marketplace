import { createServerSupabaseClient } from "@/lib/supabase.server";
import { NextRequest, NextResponse } from "next/server";

const parseSupabaseUrl = (url: string) => {
  let parsedUrl = url;
  if (url.includes("#")) {
    parsedUrl = url.replace("#", "?");
  }

  return parsedUrl;
};

export async function GET(request: NextRequest) {
  const url = parseSupabaseUrl(request.url);
  console.log("🎯 >>>>>>>>> auth/callback, url: ", url);
  const { searchParams, origin } = new URL(url);
  const code = searchParams.get("code");
  const access_token = searchParams.get("access_token");
  const refresh_token = searchParams.get("refresh_token");
  const next = searchParams.get("next") ?? "/";

  try {
    const supabase = await createServerSupabaseClient();

    if (code) {
      // Handle OAuth code flow
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("Auth error:", error);
        return NextResponse.redirect(`${origin}/auth/auth-code-error`);
      }
    } else if (access_token && refresh_token) {
      // Handle direct token login
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        console.error("Token login error:", error);
        return NextResponse.redirect(`${origin}/auth/auth-code-error`);
      }
    } else {
      // No valid authentication method
      console.log("No valid authentication method");
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    // Successful authentication
    return NextResponse.redirect(`http://localhost:3000${next}`);
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }
}
