// copied from ethers.js
export type WalletProvider = {
	/**
	 *  See [[link-eip-1193]] for details on this method.
	 */
	request(request: { method: string; params?: Array<any> | Record<string, any> }): Promise<any>
}
