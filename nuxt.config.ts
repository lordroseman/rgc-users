import tailwindcss from "@tailwindcss/vite";
import Aura from '@primeuix/themes/aura';
import fs from 'fs'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  devServer: {
    https: {
      key: fs.readFileSync('C:/laragon/etc/ssl/laragon.key', 'utf-8'),
      cert: fs.readFileSync('C:/laragon/etc/ssl/laragon.crt', 'utf-8'),
    },
    host: 'rgc-users.ribshack.test',
    port: 3000,
  },
  css: ['~/assets/css/main.css', 'primeicons/primeicons.css'],
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@primevue/nuxt-module',
    '@pinia/nuxt',
  ],
  vite: {
    plugins: [
      tailwindcss()
    ]
  },
  primevue: {
    components: {
      exclude: ['Form', 'FormField']
    },
    options: {
      theme: {
        preset: Aura
      }
    }
  }, 
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    }
  ],
  typescript: {
    typeCheck: true
  },
  runtimeConfig: {
    public: {
      loginUrl: process.env.LOGIN_URL || 'https://login.ribshack.test',
      iamApiUrl: process.env.IAM_API_URL || 'https://iam.ribshack.test',  
      sessionDomain: process.env.SESSION_DOMAIN,
      oauthClientId: process.env.OAUTH_CLIENT_ID,
      passport: {
        baseUrl: process.env.PASSPORT_BASE_URL,
        clientId: process.env.PASSPORT_CLIENT_ID,
        redirectUri: process.env.PASSPORT_REDIRECT_URI,
      }
    },

  }

})