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
        //   avatars.githubusercontent.com
          {
            protocol: "https",
            hostname: "avatars.githubusercontent.com",
            port: "",
            pathname: "/**",
          }
        ],
      },
}

module.exports = nextConfig
