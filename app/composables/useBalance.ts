import { formatEther, type Provider } from 'ethers'

export function useBalance(defaultProvider: Provider) {
	const balance = ref(0)
	const loading = ref(false)
	const error = ref(null)
	let latestFetchId = 0

	async function fetch(address: string) {
		error.value = null
		balance.value = 0
		loading.value = true

		const fetchId = ++latestFetchId

		try {
			if (fetchId === latestFetchId) {
				balance.value = Number(formatEther(await defaultProvider.getBalance(address)))
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
		balance.value = 0
		loading.value = false
	}

	return {
		balance,
		loading,
		error,
		fetch,
		ignorePreviousFetch,
	}
}
