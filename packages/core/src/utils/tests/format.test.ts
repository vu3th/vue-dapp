import { describe, expect, test } from 'vitest'
import { toHex, shortenAddress } from '../format'

test('toHex', () => {
	expect(toHex(1)).toBe('0x1')
})

describe('shortenAddress', () => {
	test('shortenAddress', () => {
		expect(shortenAddress('0x9D75F4EbcB8e7669E59dcc27CBadC698E0F77187')).toBe('0x9D75...7187')
	})

	test('shortenAddress with custom start and end length', () => {
		expect(shortenAddress('0x9D75F4EbcB8e7669E59dcc27CBadC698E0F77187', 8, 5)).toBe('0x9D75F4...77187')
	})

	test('shortenAddress with invalid address', () => {
		expect(shortenAddress('')).toBe('')
		expect(shortenAddress(null as any)).toBe('')
		expect(shortenAddress(undefined as any)).toBe('')
	})
})
