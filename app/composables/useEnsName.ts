import type { Provider } from 'ethers'

export function useEnsName(defaultProvider: Provider) {
	const ensName = ref('')
	const loading = ref(false)
	const error = ref(null)
	let latestFetchId = 0

	async function fetch(address: string) {
		error.value = null
		ensName.value = ''
		loading.value = true

		const fetchId = ++latestFetchId

		try {
			const result = await defaultProvider.lookupAddress(address)

			if (fetchId === latestFetchId) {
				ensName.value = result ?? ''
			}
		} catch (e: any) {
			if (fetchId === latestFetchId) {
				error.value = e
			}
		} finally {
			if (fetchId === latestFetchId) {
				loading.value = false
			}
		}
	}

	function ignorePreviousFetch() {
		latestFetchId++
		error.value = null
		ensName.value = ''
		loading.value = false
	}

	return {
		ensName,
		loading,
		error,
		fetch,
		ignorePreviousFetch,
	}
}
