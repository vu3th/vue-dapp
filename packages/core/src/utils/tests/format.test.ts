import { expect, test } from 'vitest'
import { toHex } from '../format'

test('toHex', () => {
	expect(toHex(1)).toBe('0x1')
})
