import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000, // Specify the port here
    historyApiFallback: true, // This ensures that React Router handles routing on all paths
  },
})
