/** @type {import('tailwindcss').Config} */
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif']
			},
			colors: {
				background: 'var(--color-background)',
				surface: 'var(--color-surface)',
				primary: 'var(--primary-black)',
				secondary: 'var(--secondary-dark)',
				inverse: 'var(--primary-white)'
			}
		}
	},
	plugins: []
};

export default config;
