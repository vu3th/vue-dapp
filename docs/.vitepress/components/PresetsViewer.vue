<template>
  <div class="presetsViewer">
    <preset-section
      v-for="[key, preset] in Object.entries(presets)"
      :key="key"
      :name="key"
      :preset="preset"
    />
  </div>
</template>

<script setup="props" lang="ts">
import PresetSection from './PresetSection.vue'
import { ref } from 'vue'
</script>

<style scoped>
.presetsViewer {
  display: flex;
  flex-direction: column;
}
</style>
