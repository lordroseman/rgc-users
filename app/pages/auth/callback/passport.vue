<script setup lang="ts">
import type { User } from "~/types/user";

const route = useRoute();
const query = route.query;
const code = query.code as string;
const state = (query.state as string) || "";

if (!code || !state) {
  throw createError({ statusCode: 400, message: "Missing code or state" });
}

const config = useRuntimeConfig();

type CodeExchangeResponse = {
  message: string;
  user: User;
};

const formData = new URLSearchParams();
formData.append("client_id", config.public.passport.clientId);
formData.append("redirect_uri", window.location.origin + "/auth/callback/passport");
formData.append("code", code);
formData.append("state", state);

try {
  const resp = await fetch(config.public.loginApiUrl + "/code-exchange", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: formData.toString(), // <- Important.
    credentials: "include",
  });

  const result = (await resp.json()) as CodeExchangeResponse;

  const data = { success: true, message: "SSO login complete", user: result.user };

  // Send message to opener window
  if (window.opener) {
    window.opener.postMessage(data, window.location.origin);
    window.close(); // Optional: close the popup after sending message
  } else {
    document.body.innerText = "No opener window found.";
  }
} catch (e) {
  console.log("error", e);
}
</script>

<template>
  <div>Signing in with Ribshack SSO</div>
</template>
