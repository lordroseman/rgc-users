import { defineStore } from "pinia";
import type { User } from "~/types/user";

export const useAuthStore = defineStore('auth', () => {

    const user = ref<User | null>(null);
    const localUser = ref<User | null>(null);
    const token = useCookie('access_token');
 
    const config = useRuntimeConfig();
    const loading = ref(false)



    const fetchUser = async () => {
        if (!token.value) {

            return null;
        }

        try {
            loading.value = true
            const response = await useAuthFetch<User>(`${config.public.iamApiUrl}/api/user`);
            if(response.success) {
                user.value = response.data;
            }
          
            loading.value = false;
            return user.value;
        } catch (error) {
          
            console.error('Failed to fetch user:', error);
            if (error instanceof Error && error.message.includes('401')) {
                // If the token is invalid, clear it 
                 logout();
            }
              loading.value = false;
            user.value = null;
            return null;
        }
    }

    
    const fetchLocalUser = async () => {
        if (!token.value) {

            return null;
        }

        try {
            loading.value = true
            const response = await useAuthFetch<User>(`${config.public.hrisApiUrl}/api/user`);
            if(response.success) {
                localUser.value = response.data;
            }
          
            loading.value = false;
            return localUser.value;
        } catch (error) {
          
            console.error('Failed to fetch user:', error);
           
            return null;
        }
    }

    const isAuthenticated = computed(() => {
        return !!user.value && !!token.value;
    });

    const logout = async () => {
        // remove the token cookie
        loading.value = true;
        const response = await useAuthFetch(config.public.iamApiUrl + '/api/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }

        })
        loading.value = false;
        if(response) {
             window.location.href = window.location.origin
            token.value = null;
            user.value = null;
        } else {
            console.log("Error logout")
        }
       
 
    }

    function decodeJwt(tkn: string): { exp: number } {
        if (!tkn) return { exp: 0 }

        try {
        const payload = tkn.split('.')[1]
                return JSON.parse(atob(payload || ''))
        } catch(e) {
            console.error(e)
            return { exp: 0 }
        }
      

    }

    async function refreshAccessToken() {

        try {
            const resp = await fetch(config.public.iamApiUrl + '/api/refresh-token', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                credentials: 'include'
            })
 

            if(resp.status === 400) { 
                throw new Error('Failed to refresh token') 
            }
            return true
        } catch (err) {
            console.error('Silent refresh failed', err)
            logout()
        }
    }

    const refreshTimer = ref<ReturnType<typeof setTimeout> | null>(null)
    function scheduleSilentRefresh(exp?: number) { 
        if (!exp) {
           
            if (!token.value)  {
                console.log("refreshing token")
             refreshAccessToken()

             return
            }
            exp = decodeJwt(token.value).exp * 1000
        }



        const delay = exp - Date.now() - 60 * 1000 // 1 min before expiry
        if (refreshTimer.value) clearTimeout(refreshTimer.value)
        console.log("Scheduling silent refresh in", delay, "ms")
        refreshTimer.value = setTimeout(() => {
            refreshAccessToken()
        }, delay)
    }






    return {
        user,
        token, 
        loading,
        localUser,
        fetchUser,
        fetchLocalUser,
        logout,
        isAuthenticated,
        scheduleSilentRefresh,
        refreshAccessToken
    }

})