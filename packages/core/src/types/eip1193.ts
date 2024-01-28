export type EIP1193Provider = {
	request(request: { method: string; params?: Array<any> | Record<string, any> }): Promise<any>
	on(eventName: string | symbol, listener: (...args: any[]) => void): void
	removeListener(eventName: string | symbol, listener: (...args: any[]) => void): void
}
