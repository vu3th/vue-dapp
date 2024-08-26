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
					to: '/installation',
				},
				{ default: () => 'Installation' },
			),
		key: '/installation',
	},
	{
		label: () =>
			h(
				NuxtLink,
				{
					to: '/eip-6963',
				},
				{ default: () => 'EIP-6963' },
			),
		key: '/eip-6963',
	},
	{
		label: () =>
			h(
				NuxtLink,
				{
					to: '/vue-dapp-modal',
				},
				{ default: () => '@vue-dapp/modal' },
			),
		key: '/vue-dapp-modal',
	},
	{
		label: 'Examples',
		key: '/examples',
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
	{
		label: 'Apps',
		key: '/apps',
		children: [
			{
				label: () => h(NuxtLink, { to: 'app/donate-with-message' }, { default: () => 'Donate with Message' }),
				key: 'app/donate-with-message',
			},
		],
	},

	{
		label: () =>
			h(
				NuxtLink,
				{
					to: '/errors',
				},
				{ default: () => 'Errors' },
			),
		key: '/errors',
	},
	{
		label: () =>
			h(
				NuxtLink,
				{
					to: '/eips',
				},
				{ default: () => 'EIPs' },
			),
		key: '/eips',
	},
	// {
	// 	label: () =>
	// 		h(
	// 			NuxtLink,
	// 			{
	// 				to: '/donate',
	// 			},
	// 			{ default: () => 'Donate' },
	// 		),
	// 	key: '/donate',
	// },
]
