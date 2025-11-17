/** @type {import('next').NextConfig} */
const nextConfig = {
    // ... autres configurations si vous en avez ...

    webpack: (config, { isServer }) => {
        if (isServer) {

            config.externals.push(
                'stream',
                'fs',
                'net',
                'tls',
                'zlib',
                '@grpc/grpc-js' 
            );
        }
        
        if (!isServer) {
            config.resolve.fallback = {
                fs: false,
                net: false,
                tls: false,
                stream: false,
                zlib: false,
            };
        }

        return config;
    },
};

module.exports = nextConfig;