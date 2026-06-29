import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/categorias':    'http://localhost:3001',
      '/fornecedores':  'http://localhost:3001',
      '/produtos':      'http://localhost:3001',
      '/movimentacoes': 'http://localhost:3001',
    },
  },
});
