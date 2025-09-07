// middleware/auth.global.ts
export default  defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  const token = useCookie('access_token')

  if (!token.value) {
    console.log("No access token found, refreshing...")

    // Ensure Nuxt waits for the async call
    await auth.refreshAccessToken()

    // If still no token after refresh, redirect
    if (!token.value) {
      const config = useRuntimeConfig()
      return navigateTo(config.public.loginUrl + '?redirect_uri=' + window.location.origin + to.fullPath, {
        external: true
      })
    }
  }

  if(!auth.user) {
    await auth.fetchUser()
  }
})
