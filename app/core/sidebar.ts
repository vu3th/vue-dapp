import { NuxtLink } from '#components'

export const sidebarMenu = [
	{
		label: () =>
			h(
				NuxtLink,
				{
					to: '/overview',
				},
				{ default: () => 'Overview' },
			),
		key: '/overview',
	},
	{
		label: () =>
			h(
				NuxtLink,
				{
					to: '/modal',
				},
				{ default: () => '@vue-dapp/modal' },
			),
		key: '/modal',
	},
	{
		label: 'Examples',
		key: 'Examples',
		children: [
			{
				label: () =>
					h(
						NuxtLink,
						{
							to: '/examples/contract',
						},
						{ default: () => 'Contract' },
					),
				key: '/examples/contract',
			},
			{
				label: () =>
					h(
						NuxtLink,
						{
							to: '/examples/multicall',
						},
						{ default: () => 'Multicall' },
					),
				key: '/examples/multicall',
			},
		],
	},
]
