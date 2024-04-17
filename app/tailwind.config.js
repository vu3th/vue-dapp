/** @type {import('tailwindcss').Config} */
const breakpoints = require('./styles/breakpoints.json')

module.exports = {
	plugins: [require('@tailwindcss/typography')],
	content: [
		'./components/**/*.{js,vue,ts}',
		'./layouts/**/*.vue',
		'./pages/**/*.vue',
		'./plugins/**/*.{js,ts}',
		'./app.vue',
		'./error.vue',
	],
	theme: {
		screens: breakpoints,
		extend: {
			colors: {
				primary: {
					dark: '#586063',
					DEFAULT: '#ababab',
					light: '#edecea',
				},
				secondary: {
					dark: '#016665',
					DEFAULT: '#00807E',
					light: '#65B1B1',
				},
			},
		},
		// backgroundSize: {
		// 	auto: 'auto',
		// 	cover: 'cover',
		// 	contain: 'contain',
		// 	'50%': '50%',
		// 	16: '4rem',
		// },
	},
}
