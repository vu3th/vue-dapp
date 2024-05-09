<script setup lang="ts">
import { watch, computed } from 'vue'

const props = withDefaults(
	defineProps<{
		modalOpen: boolean
		dark?: boolean
	}>(),
	{
		dark: false,
	},
)

const emit = defineEmits(['close'])

const modalInnerClass = computed(() => (props.dark ? 'modal-inner--dark' : 'modal-inner'))

// prevent page scrolling when the modal is open
watch(
	() => props.modalOpen,
	value => {
		if (value) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
	},
)
</script>

<template>
	<teleport to="body">
		<transition name="vd-modal-animation">
			<div v-if="modalOpen" id="vd-modal-base">
				<div :class="modalInnerClass">
					<div class="modal-content">
						<!-- Modal Content -->
						<slot />
					</div>
				</div>
			</div>
		</transition>
	</teleport>
</template>

<style scoped>
#vd-modal-base {
	position: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	min-width: 100%;
	height: 100%;
	background-color: rgba(107, 114, 128, 0.7);
	left: 0px;
	top: 0px;
	z-index: 50;
}

#vd-modal-base .modal-inner {
	display: flex;
	background: #ffffff;
	border-radius: 1rem;
	box-shadow:
		rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset,
		rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
		rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
}

#vd-modal-base .modal-inner--dark {
	display: flex;
	color: rgb(199, 199, 199);
	background: #273138;
	border-radius: 1rem;
	box-shadow:
		rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset,
		rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
		rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
}

.vd-modal-animation-enter-active,
.vd-modal-animation-leave-active {
	transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.vd-modal-animation-enter-from,
.vd-modal-animation-leave-to {
	opacity: 0;
}
</style>
