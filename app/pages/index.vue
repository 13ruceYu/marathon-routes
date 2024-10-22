<script setup lang="ts">
import { FULL_MARATHON_DISTANCE, SHANGHAI_ROUTE } from '~/constants'

const trackRef = useTemplateRef<SVGPathElement>('trackRef')
const splitStart = ref(0)
const splitEnd = ref(0)
const scrollPercentage = ref(0)
const scrollContainer = useTemplateRef<HTMLDivElement>('scrollContainer')
const { y } = useWindowScroll()
const trackPathLength = ref(0)
const currentSplit = ref({})
const pathOffset = computed(() => {
  return trackPathLength.value * (1 - scrollPercentage.value)
})
const rangeLength = computed(() => {
  return (splitEnd.value - splitStart.value) * trackPathLength.value
})
const rangeOffset = computed(() => {
  return -splitStart.value * trackPathLength.value
})
const { width: windowWidth } = useWindowSize()
const showSplitName = ref(true)

const splitList = computed(() => {
  const baseSplits = Array.from({ length: 42 }, (_, i) => i + 1)
  return baseSplits.map((km) => {
    return {
      st: (km - 1) / FULL_MARATHON_DISTANCE,
      ed: km / FULL_MARATHON_DISTANCE,
      ch: `${km}km`,
      km,
      hidden: km % 2 !== 0 && windowWidth.value < 1024,
    }
  }).map((c) => {
    const cXY = trackRef.value && trackRef.value.getPointAtLength(trackPathLength.value * (c.km / FULL_MARATHON_DISTANCE))
    return {
      ...c,
      ...(cXY ? { x: cXY.x / 660, y: cXY.y / 530 } : {}),
    }
  })
})

onMounted(() => {
  if (!trackRef.value)
    return
  trackPathLength.value = trackRef.value.getTotalLength()
  calcScrollPercentage()
  setRange()
})

watch(y, () => {
  calcScrollPercentage()
  setRange()
})

function setRange() {
  splitList.value.forEach((split) => {
    if (scrollPercentage.value > split.st && scrollPercentage.value < split.ed) {
      splitStart.value = split.st
      splitEnd.value = split.ed
      currentSplit.value = split
    }
  })
}

function calcScrollPercentage() {
  if (!scrollContainer.value)
    return
  scrollPercentage.value = window.scrollY / (scrollContainer.value.scrollHeight - window.innerHeight)
}

function handleSplitNameClick(percentage: number) {
  if (!scrollContainer.value)
    return
  window.scrollTo(0, percentage * (scrollContainer.value.scrollHeight - window.innerHeight))
}
</script>

<template>
  <div ref="scrollContainer" class="scroll-container h-screen">
    <div class="h-[8000vh]">
      <div class="fixed grid grid-cols-1 h-screen w-full md:grid-cols-[3fr_2fr]">
        <div class="track-map dot-bg flex items-center justify-center">
          <div class="inner relative aspect-ratio-660/530 max-h-[55vh] max-w-[92vw] flex items-center justify-center md:max-h-[100vh] md:max-w-[60vw] md:max-w-[90vw]">
            <svg class="h-full w-full" viewBox="0 0 660 530" width="6600px" height="5300px" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <path
                  id="track"
                  ref="trackRef"
                  :d="SHANGHAI_ROUTE"
                />
              </defs>
              <use href="#track" class="base stroke-width-4 stroke-base-text" />
              <g
                class="split"
                :class="[scrollPercentage ? '' : 'hidden']"
              >
                <use
                  href="#track"
                  class="path stroke-width-6 stroke-red-6"
                  :style="{ strokeDasharray: `${rangeLength} ${trackPathLength}`, strokeDashoffset: rangeOffset }"
                />
              </g>
              <use href="#track" class="progress stroke-width-1 stroke-base-bg transition-all duration-500 ease-out" :style="{ strokeDasharray: trackPathLength, strokeDashoffset: pathOffset }" />
            </svg>
            <template v-if="showSplitName">
              <div
                v-for="(c, key) in splitList"
                :key="key"
                class="split-name absolute cursor-pointer text-xs text-shadow"
                :class="[
                  (c.st < scrollPercentage) || c.st < scrollPercentage && scrollPercentage < c.ed ? 'highlighted' : 'opacity-50',
                  c.hidden && 'hidden']"
                :style=" `left: ${(c.x || 0) * 100}%; top: ${(c.y || 0) * 100}%;`"
                @click="handleSplitNameClick(c.ed)"
              >
                {{ c.ch }}
              </div>
            </template>
          </div>
        </div>
        <div class="detail-info flex flex-col justify-between p-4 md:border-l">
          <h1 class="flex text-3xl text-base-text">
            Berlin Marathon <div class="i-ic-outline-unfold-more" />
          </h1>
          <p><span class="km-text-shadow text-6xl font-bold tracking-tighter font-mono italic">{{ (FULL_MARATHON_DISTANCE * scrollPercentage).toFixed(3) }}</span><span class="ml-2 text-xl font-bold">KM</span></p>
          <div>
            <ToggleButton v-model="showSplitName">
              <span class="text-sm text-gray hover:text-dark">显示公里数</span>
            </ToggleButton>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dot-bg {
  background-image: radial-gradient(gray 0.5px, transparent 0.5px), radial-gradient(gray 0.5px, transparent 0.5px);
  background-size: 14px 14px;
  background-position:
    0 0,
    7px 7px;
}

.text-shadow {
  text-shadow:
    0.1em 0 0 var(--base-bg),
    -0.1em 0 0 var(--base-bg),
    0 0.1em 0 var(--base-bg),
    0 -0.1em 0 var(--base-bg);
}

.km-text-shadow {
  text-shadow:
    0.02em 0.02em 0 var(--base-bg),
    0.04em 0.04em 0 #ddd;
}
</style>
