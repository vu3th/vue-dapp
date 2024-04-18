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
		key: 'Overview',
	},
	{
		label: () =>
			h(
				NuxtLink,
				{
					to: '/wallet',
				},
				{ default: () => 'Wallet' },
			),
		key: 'Wallet',
	},
	{
		label: () =>
			h(
				NuxtLink,
				{
					to: '/vue-dapp-provider',
				},
				{ default: () => 'VueDappProvider' },
			),
		key: 'VueDappProvider',
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
				key: 'Contract',
			},
			{
				label: () =>
					h(
						NuxtLink,
						{
							to: '/',
						},
						{ default: () => 'VueDappProvider' },
					),
				key: 'Multicall',
			},
			{
				label: () =>
					h(
						NuxtLink,
						{
							to: '/',
						},
						{ default: () => 'VueDappProvider' },
					),
				key: 'Switch chain',
			},
		],
	},
]
