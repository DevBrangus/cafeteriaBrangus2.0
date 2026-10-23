/**
 * Configuración de Vite (servidor de desarrollo y compilación).
 *
 * - react(): habilita JSX y el recargado en caliente de componentes.
 * - tailwindcss(): procesa Tailwind CSS v4 (las clases y el @theme de index.css).
 *
 * Comandos: `npm run dev` (desarrollo) y `npm run build` (genera la carpeta dist).
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ]
})
