/** @type {import('tailwindcss').Config} */
const breakpoints = require('./styles/breakpoints.json')

module.exports = {
	content: [
		'./components/**/*.{vue,js,ts}',
		'./layouts/**/*.vue',
		'./pages/**/*.vue',
		'./composables/**/*.{js,ts}',
		'./plugins/**/*.{js,ts}',
		'./app.{js,ts,vue}',
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
	plugins: [],
}
