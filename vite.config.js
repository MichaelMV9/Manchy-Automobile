import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        cars: resolve(__dirname, 'cars.html'),
        about: resolve(__dirname, 'about.html'),
        staff: resolve(__dirname, 'staff.html'),
        contact: resolve(__dirname, 'contact.html'),
        carDetails: resolve(__dirname, 'car-details.html'),
      },
    },
    outDir: 'dist',
    assetsDir: 'assets',
    copyPublicDir: true,
  },
  publicDir: 'public',
});
