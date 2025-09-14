 

export function useCan() {

    const authStore  = useAuthStore()


    const can = (p: string) => {
        if(!authStore.isAuthenticated) return false

        const roles = authStore.user!.roles!

        if(roles.includes('super-admin')) return true

        const permission = authStore.user!.permissions ?? [];

        if(p.includes('*')) {
            const wildcardIndex = p.indexOf('*')
            const prefix = p.substring(0, wildcardIndex)
            return permission.some((perm: string) => perm.startsWith(prefix))
        }

        return permission.includes(p)

    }

    return {
        can
    }

}
