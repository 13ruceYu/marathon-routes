<script lang="ts" setup>
const model = defineModel({ default: false })
const dialogRef = useTemplateRef<HTMLDivElement>('dialogRef')

onClickOutside(dialogRef, () => {
  model.value = false
})
</script>

<template>
  <transition>
    <div v-show="model" class="dialog fixed bottom-0 left-0 right-0 top-0 z-999 flex items-center justify-center">
      <div ref="dialogRef" class="h-[50vh] w-[60vw] border rounded-[6px] bg-base-bg p-1 shadow-sm">
        <div class="h-8 flex justify-end">
          <div
            class="h-6 w-6 flex cursor-pointer items-center justify-center rounded-[5px] text-gray transition-all hover:bg-gray-2 hover:text-dark"
            @click="model = false"
          >
            <div i-carbon-close />
          </div>
        </div>
        <div class="h-[calc(50vh-3rem)] overflow-auto">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
