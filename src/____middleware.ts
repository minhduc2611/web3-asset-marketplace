import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// export async function middleware(request: NextRequest) {
//   let supabaseResponse = NextResponse.next({
//     request,
//   });
//   const response = NextResponse.next({
//     request: {
//       headers: request.headers,
//     },
//   });

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll();
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value, options }) =>
//             request.cookies.set(name, value)
//           );
//           supabaseResponse = NextResponse.next({
//             request,
//           });
//           cookiesToSet.forEach(({ name, value, options }) =>
//             supabaseResponse.cookies.set(name, value, options)
//           );
//         },
//       },
//     }
//   );

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   // Define public routes that don't require authentication
//   const publicRoutes = ["/login", "/signup", "/auth/callback", "/"];
//   const isNotPublicRoute = !publicRoutes.includes(request.nextUrl.pathname);
//   const isNotAuthenticated = !user;

// //   Debug logging
//   console.log("🔒 Middleware:", {
//     pathname: request.nextUrl.pathname,
//     isNotPublicRoute,
//     isNotAuthenticated,
//     user,
//   });

//   // Redirect to login if accessing protected route without authentication
//   if (isNotAuthenticated && isNotPublicRoute) {
//     const redirectUrl = new URL("/login", request.url);
//     redirectUrl.searchParams.set("next", request.nextUrl.pathname);
//     return NextResponse.redirect(redirectUrl);
//   }

// //   const {
// //     data: { user },
// //   } = await supabase.auth.getUser();

// //   if (
// //     !user &&
// //     !request.nextUrl.pathname.startsWith("/login") &&
// //     !request.nextUrl.pathname.startsWith("/auth")
// //   ) {
// //     // no user, potentially respond by redirecting the user to the login page
// //     const url = request.nextUrl.clone();
// //     url.pathname = "/login";
// //     return NextResponse.redirect(url);
// //   }

//   return response;
// }

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
