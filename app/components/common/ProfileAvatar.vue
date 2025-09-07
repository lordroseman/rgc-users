<!-- ProfileAvatar.vue -->

<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = defineProps({
  name: { type: String, default: "" },
  size: { type: [Number, String], default: 36 }, // px
  src: { type: String, default: "" }, // optional image URL (fallback to letter)
  alt: { type: String, default: "Avatar" },
  fontSizeRatio: { type: Number, default: 0.5 }, // letter size relative to container
  rounded: { type: Boolean, default: true }, // circle if true
});

const emit = defineEmits(["error"]);

const letter = computed(() => {
  const n: string = (props.name ?? "").trim();
  return n.length > 0 ? n[0]?.toUpperCase() : "?";
});

const ariaLabel = computed(() => {
  return props.name ? `${props.name} avatar` : "avatar";
});

// deterministic color picker based on first letter
const bgColors = [
  "#F44336",
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#3F51B5",
  "#2196F3",
  "#03A9F4",
  "#00BCD4",
  "#009688",
  "#4CAF50",
  "#8BC34A",
  "#CDDC39",
  "#FFC107",
  "#FF9800",
  "#FF5722",
  "#795548",
  "#607D8B",
];

function colorFromString(s = "") {
  if (!s) return bgColors[0];
  // simple hash: sum of char codes
  let sum = 0;
  for (let i = 0; i < s.length; i++) sum = (sum * 31 + s.charCodeAt(i)) >>> 0;
  return bgColors[sum % bgColors.length];
}

const bg = computed(() => colorFromString(letter.value));

const sizePx = computed(() =>
  typeof props.size === "number" ? `${props.size}px` : props.size
);

const avatarStyle = computed(() => ({
  width: sizePx.value,
  height: sizePx.value,
  lineHeight: sizePx.value,
  borderRadius: props.rounded ? "50%" : "6px",
  fontSize: `${Math.floor(Number(props.size) * props.fontSizeRatio)}px`,
  backgroundColor: bg.value,
}));

// image fallback handling
const imageLoaded = ref(false);
watch(
  () => props.src,
  (v) => {
    imageLoaded.value = false;
    if (!v) return;
    // pre-load
    const img = new Image();
    img.onload = () => (imageLoaded.value = true);
    img.onerror = () => {
      imageLoaded.value = false;
      emit("error");
    };
    img.src = v;
  }
);

function onImgError() {
  imageLoaded.value = false;
  emit("error");
}
</script>

<template>
  <div
    :class="['profile-avatar', { 'has-image': !!src }]"
    :style="avatarStyle"
    role="img"
    :aria-label="ariaLabel"
  >
    <img v-if="src && imageLoaded" :src="src" :alt="alt" @error="onImgError" >
    <span v-else class="letter">{{ letter }}</span>
  </div>
</template>

<style scoped>
.profile-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  user-select: none;
  overflow: hidden;
  text-transform: uppercase;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}
.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.letter {
  display: inline-block;
  transform: translateY(-1px); /* optical centering */
}
</style>
