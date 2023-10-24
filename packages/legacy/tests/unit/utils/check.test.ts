import { describe, expect, it } from 'vitest'
import { checkChainId } from '@/utils'

describe('checkChainId', () => {
	it('should return true when chain id is in the available network', () => {
		expect(checkChainId(1)).toBeTruthy()
		expect(checkChainId(5)).toBeTruthy()
	})
	it('should return false when chain id is not in the available network', () => {
		expect(checkChainId(2)).toBeFalsy()
		expect(checkChainId(4)).toBeFalsy()
	})
})
