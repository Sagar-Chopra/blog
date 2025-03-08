/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/blogs', // Change this to your desired route
          permanent: true, // Set to true for SEO-friendly 301 redirect, false for temporary
        },
      ];
    },
  };
  
  export default nextConfig;
