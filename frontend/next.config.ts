import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // imageタグのsrcとして有効にする許可オリジンを設定する
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "s3-minio",
        port: "9000",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
