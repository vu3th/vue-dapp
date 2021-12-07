<script setup lang="ts">
import { ref, toRefs } from 'vue'

const emit = defineEmits(['update:selected'])
const props = defineProps<{
  options: number[] | string[] | object[] | undefined[]
  selected: number | string | object | undefined
  filterFn?: (...args: any[]) => any
}>()

const { options, selected } = toRefs(props)

const dropdown = ref(false)
const dropdownHandler = () => {
  dropdown.value = !dropdown.value
}

const select = (option: number | string | object | undefined) => {
  emit('update:selected', option)
}
</script>

<template>
  <div class="relative inline-block text-left">
    <div>
      <button
        @click="dropdownHandler"
        v-click-outside="() => (dropdown = false)"
        type="button"
        class="
          inline-flex
          justify-center
          w-full
          capitalize
          rounded-md
          border border-gray-300
          shadow-sm
          px-4
          py-2
          bg-white
          text-sm
          font-medium
          text-gray-700
          hover:bg-gray-50
          focus:outline-none
        "
        aria-expanded="true"
        aria-haspopup="true"
      >
        {{ filterFn ? filterFn(selected) : selected }}
        <svg
          class="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <div
      v-if="dropdown"
      class="
        origin-top-right
        absolute
        right-0
        mt-2
        w-30
        rounded-md
        shadow-lg
        bg-white
        ring-1 ring-black ring-opacity-5
        focus:outline-none
      "
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabindex="-1"
    >
      <div class="py-1" role="none">
        <div
          v-for="(option, i) in options"
          :key="i"
          @click="select(option)"
          href="#"
          class="
            text-gray-700
            capitalize
            block
            px-4
            py-2
            text-sm
            hover:bg-gray-100
            cursor-pointer
          "
          role="menuitem"
          tabindex="-1"
          id="menu-item-0"
        >
          {{ filterFn ? filterFn(option) : option }}
        </div>
      </div>
    </div>
  </div>
</template>
