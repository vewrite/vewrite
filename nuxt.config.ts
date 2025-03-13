// import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ],
    }
  },

  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    "@samk-dev/nuxt-vcalendar",
    '@nuxt/icon',
    'nuxt-tiptap-editor',
    'nuxt-module-hotjar'
  ],

  css: [
    '@/assets/main.scss',
    '@/assets/_variables.scss',
  ],

  googleFonts: {
    families: {
      'Noto Sans': true
    }
  },

  compatibilityDate: '2024-08-08',
  pages: true,

  devtools: {
    enabled: false,
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    }
  },

  hotjar: {
    hotjarId: 5335288,
    scriptVersion: 6,
  },

  runtimeConfig: {
    // Server-side environment variables
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      stripePriceId: process.env.STRIPE_PRICE_ID,
      appUrl: process.env.APP_URL
    },
  },

  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
  },

  nitro: {
    externals: {
      inline: ['stripe']
    }
  }

})