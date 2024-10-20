<script setup lang="ts">
import { appName } from '~/constants'

useHead({
  title: appName,
})
</script>

<template>
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html,
body,
#__nuxt {
  scroll-behavior: smooth;
}

html {
  --base-bg: #fff;
  --base-text: #222;
}

html.dark {
  --base-bg: #222;
  --base-text: #fff;
}

html {
  background: var(--base-bg);
  color: var(--base-text);
}
</style>
