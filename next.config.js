/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "assets.vercel.com",
            port: "",
            pathname: "/image/upload/**",
          },
          {
            protocol: "https",
            hostname: "avatars.githubusercontent.com",
            port: "",
            pathname: "/**",
          },
          {
            protocol: "https",
            hostname: "cdn-icons-png.flaticon.com",
            port: "",
            pathname: "/**",
          },
          {
            protocol: "https",
            hostname: "lh3.googleusercontent.com",
            port: "",
            pathname: "/**",
          }
        ],
      },
}

module.exports = nextConfig
