import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { r3f } from '@react-three/editor/vite'
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    command === 'serve' // only during dev mode
      ? r3f()
      : react(),
    visualizer({
      open: true, // Opens the report in your browser
      filename: "bundle-analysis.html", // Output file name
      gzipSize: true, // Show gzip sizes
      brotliSize: true, // Show brotli sizes
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host:true,
    port:5173,
    watch:{
      usePolling:true
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})