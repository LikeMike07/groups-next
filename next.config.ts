import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '27xpqfnouu.ufs.sh',
            },
        ],
    },
};

export default nextConfig;
