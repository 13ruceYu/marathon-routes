<script setup lang="ts">
const model = defineModel({ default: false })
</script>

<template>
  <div class="toggle-button inline-flex cursor-pointer items-center gap-2 text-sm" :class="[model ? 'on' : 'off']" @click="model = !model">
    <slot />
    <div class="toggle transition" />
  </div>
</template>

<style scoped>
.on .toggle::before {
  content: 'ON';
  left: 2.6em;
}
.on .toggle::after {
  left: 1.4em;
  width: 1.3em;
  background: theme('colors.red.600');
}
.off .toggle::after {
  left: 0.2em;
}
.toggle {
  border: 1px solid var(--base-text);
  width: 3em;
  height: 1.5em;
  border-radius: 0.3em 0.15em 0.3em 0.15em;
  position: relative;
}
.toggle::after {
  content: '';
  display: block;
  width: 1.5em;
  height: 1em;
  background: var(--base-text);
  border-radius: 0.2em;
  position: absolute;
  top: 0.2em;
  border-radius: 0.1em;
  transition: all 0.2s ease-in-out;
}
.toggle::before {
  content: 'OFF';
  display: block;
  color: var(--base-bg);
  position: absolute;
  border-radius: 0.1em;
  z-index: 2;
  font-size: 0.6em;
  left: 0.5em;
  font-weight: 700;
  transition: all 0.2s ease-in-out;
}
</style>
