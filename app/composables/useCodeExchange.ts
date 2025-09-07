import type { AuthResponse } from "~/types/user";

export const useCodeExchange = async  (
    code: string,
    code_verifier: string
  ) => {


  

    const config = useRuntimeConfig();
   
 return  $fetch<AuthResponse>(config.public.passport.baseUrl + '/oauth/token', {
    method: 'POST',
    body:  {
        grant_type: 'authorization_code',
        client_id: config.public.oauthClientId,
        redirect_uri: window.location.origin + '/auth/callback',
        code: code,
        code_verifier: code_verifier
    },
    headers: {  
    'Content-Type':  'application/json',
    'Accept': 'application/json'
    },
    credentials: 'omit'
  });
}