import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { useWallet } from '@/composables'

// wip: refer to https://github.com/Mini-ghost/vorms/blob/main/packages/core/tests/composiable/useForm.test.ts

// const noop = () => {}

const setup = (setup: () => unknown) => {
	const Comp = defineComponent({
		setup,
		template: `<div />`,
	})

	return mount(Comp)
}

// const sleep = (ms?: number) => {
//   return new Promise((resolve) => setTimeout(resolve, ms))
// }

describe('useWallet', () => {
	it('when initialize wallet state', () => {
		setup(() => {
			const { wallet } = useWallet()
			expect(wallet.connector).toEqual(null)
			expect(wallet.error).toEqual('')
			expect(wallet.provider).toEqual(null)
			expect(wallet.status).toEqual('none')
		})
	})
})
