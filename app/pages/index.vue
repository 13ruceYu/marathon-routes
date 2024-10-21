<script setup lang="ts">
import { BERLIN_ROUTE, FULL_MARATHON_DISTANCE } from '~/constants'

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
const splitList = computed(() => {
  const baseSplits = Array.from({ length: 42 }, (_, i) => i + 1)
  return baseSplits.map((km) => {
    return {
      st: (km - 1) / FULL_MARATHON_DISTANCE,
      ed: km / FULL_MARATHON_DISTANCE,
      ch: `${km}km`,
      km,
    }
  }).map((c) => {
    const cXY = trackRef.value && trackRef.value.getPointAtLength(trackPathLength.value * (c.km / FULL_MARATHON_DISTANCE))
    return {
      ...c,
      ...(cXY ? { x: cXY.x / 660, y: cXY.y / 530 } : {}),
    }
  })
})
const { width: windowWidth } = useWindowSize()

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
          <div class="inner relative aspect-ratio-660/530 max-h-[100vh] max-w-[90vw] flex items-center justify-center md:max-w-[60vw]">
            <svg class="h-full w-full" viewBox="0 0 660 530" width="6600px" height="5300px" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <!-- d="M339 167.5L206.923 181.53C204.56 181.781 202.5 179.929 202.5 177.553V171.435C202.5 170.82 202.642 170.213 202.914 169.662L224.708 125.59C224.901 125.199 225.157 124.843 225.465 124.535L227.616 122.384C228.192 121.808 228.578 121.071 228.724 120.271L229.072 118.354C229.336 116.904 230.375 115.717 231.776 115.264L262.515 105.319C263.161 105.11 263.85 105.069 264.516 105.199L364.475 124.799C365.147 124.931 365.774 125.233 366.296 125.677L373.869 132.114C374.888 132.98 376.272 133.279 377.558 132.912L431.945 117.373C433.734 116.862 434.934 115.185 434.841 113.327L434.153 99.5646C434.063 97.7568 435.198 96.1137 436.92 95.558L479.901 81.6932C480.298 81.5652 480.712 81.5 481.129 81.5H492.827C493.273 81.5 493.715 81.5744 494.136 81.7201L531.959 94.8126C532.318 94.9369 532.657 95.1117 532.967 95.3318L548.434 106.322C550.157 107.546 550.63 109.899 549.514 111.694L542.328 123.255C541.08 125.262 541.835 127.907 543.953 128.953L578.869 146.206C580.867 147.193 581.673 149.623 580.66 151.609L558.133 195.796C557.205 197.618 555.051 198.446 553.141 197.716L542.924 193.809C540.987 193.068 538.804 193.931 537.898 195.797L515.229 242.443C514.271 244.414 515.077 246.789 517.038 247.769L546.061 262.28C546.984 262.742 547.693 263.543 548.04 264.516L571.045 329.107C572.106 332.086 569.453 335.061 566.372 334.345L545.5 329.5L505.5 320.5L423.584 294.503C422.57 294.181 421.47 294.276 420.526 294.768L399.449 305.745C398.52 306.229 397.439 306.329 396.437 306.024L345.665 290.572C343.095 289.79 340.5 291.712 340.5 294.399V308.151C340.5 310.089 339.111 311.748 337.203 312.089L287.739 320.922C285.857 321.258 284.476 322.878 284.442 324.789L283.522 377.238C283.508 378.059 283.241 378.856 282.758 379.521L242.253 435.214C240.808 437.202 237.928 437.428 236.19 435.69L227.574 427.074C226.882 426.382 225.961 425.968 224.984 425.909L194.325 424.079C193.465 424.028 192.611 424.256 191.89 424.729L160.126 445.603C158.829 446.455 157.155 446.48 155.833 445.667L153.782 444.404C152.401 443.555 150.644 443.622 149.333 444.576L147.588 445.845C146.586 446.574 145.304 446.797 144.115 446.45L87.152 429.836C86.4005 429.617 85.7299 429.182 85.2232 428.585L57.4831 395.924C56.0952 394.29 56.2425 391.852 57.8171 390.397L126.35 327.062C127.09 326.379 128.059 326 129.065 326H145.072C145.683 326 146.285 325.86 146.833 325.592L167.287 315.565C169.497 314.482 170.214 311.678 168.794 309.667L160.55 297.987C159.883 297.042 159.657 295.855 159.932 294.732L169.453 255.739C169.792 254.353 170.843 253.252 172.212 252.85L248.259 230.511C249.366 230.186 250.558 230.355 251.531 230.973L286.278 253.041C286.754 253.344 287.289 253.542 287.847 253.623L314.036 257.433C314.344 257.477 314.646 257.558 314.936 257.673L341.712 268.298C343.975 269.196 346.508 267.881 347.077 265.514L348.891 257.953C348.964 257.652 349.07 257.36 349.21 257.084L374.578 206.836C374.856 206.286 375.256 205.808 375.749 205.438L378.119 203.661C378.696 203.228 379.378 202.96 380.095 202.883L453.681 195.034C453.893 195.011 454.103 194.972 454.309 194.916L458.983 193.641C459.326 193.547 459.68 193.5 460.036 193.5H467.418C469.841 193.5 471.708 191.361 471.381 188.96L470.972 185.96C470.701 183.978 469.009 182.5 467.008 182.5H463.242C461.136 182.5 459.391 180.867 459.251 178.766L458.774 171.617C458.624 169.365 456.64 167.682 454.393 167.903L437.39 169.57C435.038 169.8 433 167.952 433 165.589V162.347C433 160.007 431 158.167 428.668 158.361L379 162.5" -->
                <path
                  id="track"
                  ref="trackRef"
                  :d="BERLIN_ROUTE"
                  stroke-linecap="round"
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
            <div
              v-for="(c, key) in splitList"
              :key="key"
              class="split-name absolute cursor-pointer text-xs text-shadow"
              :class="[
                (c.st < scrollPercentage) || c.st < scrollPercentage && scrollPercentage < c.ed ? 'highlighted' : 'opacity-50',
                windowWidth < 1024 && (c.km % 2 !== 0) && 'hidden']"
              :style=" `left: ${(c.x || 0) * 100}%; top: ${(c.y || 0) * 100}%;`"
              @click="handleSplitNameClick(c.ed)"
            >
              {{ c.ch }}
            </div>
          </div>
        </div>
        <div class="detail-info flex flex-col justify-between p-4 md:border-l">
          <h1 class="text-3xl text-base-text">
            Berlin Marathon
          </h1>
          <p><span class="km-text-shadow text-6xl font-bold tracking-tighter font-mono italic">{{ (FULL_MARATHON_DISTANCE * scrollPercentage).toFixed(3) }}</span><span class="ml-2 text-xl font-bold">KM</span></p>
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
