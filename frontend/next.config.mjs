/** @type {import('next').NextConfig} */
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig = {

  turbopack: {
    root: path.resolve(__dirname),
  },

  reactCompiler: true,
}

export default nextConfig
