import { EIP1193Provider } from './eip1193'

export enum RDNS {
	'rabby' = 'io.rabby',
	'metamask' = 'io.metamask',
	'brave' = 'com.brave.wallet',
	'coinbase' = 'com.coinbase.wallet',
	'bitget' = 'com.bitget.web3wallet',
}

export interface EIP6963ProviderInfo {
	uuid: string
	name: string
	icon: string
	rdns: string
}

export interface EIP6963ProviderDetail {
	info: EIP6963ProviderInfo
	provider: EIP1193Provider
}

export interface EIP6963AnnounceProviderEvent extends CustomEvent {
	type: 'eip6963:announceProvider'
	detail: EIP6963ProviderDetail
}

export interface EIP6963RequestProviderEvent extends Event {
	type: 'eip6963:requestProvider'
}
