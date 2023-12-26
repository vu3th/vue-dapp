<script lang="ts" setup></script>

<template>
	<div>
		<Web3Provider>
			<TheHeader />
			<slot />
			<TheFooter />
		</Web3Provider>
	</div>
</template>
