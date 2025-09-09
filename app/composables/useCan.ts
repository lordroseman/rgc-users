 

export function useCan() {

    const authStore  = useAuthStore()


    const can = (p: string) => {
        if(!authStore.isAuthenticated) return false

        const roles = authStore.user!.roles!

        if(roles.includes('super-admin')) return true

        const permission = authStore.user!.permissions ?? [];

        if(p.includes('*')) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [resource, action] = p.split('.')
            return permission.some((perm: string) => perm.startsWith(resource!))
        }

        return permission.includes(p)

    }

    return {
        can
    }

}
