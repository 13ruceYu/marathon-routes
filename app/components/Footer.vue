<script lang="ts" setup>
const { locale, setLocale } = useI18n()
</script>

<template>
  <div text="xl gray4" m-1 flex="~ gap3" justify-center>
    <a i-carbon-logo-github href="https://github.com/13ruceYu/marathon-routes" target="_blank" />
    <DarkToggle />
    <div i-carbon-translate class="cursor-pointer" @click="setLocale(locale === 'en' ? 'zh' : 'en')" />
  </div>
</template>
