/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.roblox.com' },
      { protocol: 'https', hostname: 'tr.rbxcdn.com' },
      { protocol: 'https', hostname: 't0.rbxcdn.com' },
      { protocol: 'https', hostname: 't1.rbxcdn.com' },
      { protocol: 'https', hostname: 't2.rbxcdn.com' },
      { protocol: 'https', hostname: 't3.rbxcdn.com' },
    ],
  },
};
export default nextConfig;