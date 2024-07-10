// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';


export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'mask-icon.svg',
        'safari-pinned-tab.svg',
      ],
      manifest: {
        name: 'Appointment System for Clinics',
        short_name: 'Appointments',

        theme_color: '#ffffff',
        background_color: '#ffffff',
        start_url: '/',
        display: 'standalone',

        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'apple-touch-icon-180x180.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
          description:'HealthConnect simplifies doctor appointment scheduling with an easy-to-use platform. Book, reschedule, and cancel appointments effortlessly. Browse detailed profiles and reviews to find the best providers. Receive timely reminders, store medical records securely, and access telehealth services. Experience hassle-free healthcare with HealthConnect!',
              screenshots: [
          {
            src: '1.png',
            sizes: '640x480',
            type: 'image/png',
            form_factor: 'narrow',
          },
          {
            src: '2.png',
            sizes: '640x480',
            type: 'image/png',
            form_factor: 'narrow',
          },
          {
            src: '3.png',
            sizes: '640x480',
            type: 'image/png',
            form_factor: 'narrow',
          },
          {
            src: '4.png',
            sizes: '640x480',
            type: 'image/png',
            form_factor: 'narrow',
          },
          {
            src: '5.png',
            sizes: '640x480',
            type: 'image/png',
            form_factor: 'narrow',
          },
        ],
      },
    }),
  ],
});
