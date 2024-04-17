import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

export default function useRWD() {
	const breakpoints = useBreakpoints(breakpointsTailwind)

	const isMobileScreen = breakpoints.smallerOrEqual('sm')

	const isLargerThanMd = breakpoints.greater('md')

	const isSmallerThanMd = breakpoints.smaller('md')

	const isBelowMdBreakpoint = breakpoints.smallerOrEqual('md')

	return {
		isMobileScreen,
		isLargerThanMd,
		isSmallerThanMd,
		isBelowMdBreakpoint,
	}
}
