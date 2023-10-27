<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCount } from '../stores/count'

const countStore = useCount()
const { count } = storeToRefs(countStore)
</script>

<template>
	<div>Hello Pinia, Count {{ count }}</div>
	<button @click="countStore.inc">increase count</button>
	<button @click="countStore.dec">decrease count</button>
</template>
