import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        cars: resolve(__dirname, 'cars.html'),
        carDetails: resolve(__dirname, 'car-details.html'),
        about: resolve(__dirname, 'about.html'),
        staff: resolve(__dirname, 'staff.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
})
