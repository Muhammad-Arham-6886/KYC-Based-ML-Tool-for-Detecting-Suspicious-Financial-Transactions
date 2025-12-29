import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		environment: 'jsdom',
		globals: true,
		include: ['src/**/*.vitest.*'],
		setupFiles: 'src/setupTests.ts'
		,
		// Inline common runtime deps to avoid SSR helper injection
		deps: {
			inline: ['@reduxjs/toolkit', 'react-redux']
		},
		transformMode: {
			web: [/.*\.([jt]sx?)$/]
		}
	}
})

// Additional Vite options to avoid SSR transform artifacts when running tests
export const vite = {
	server: {
		deps: {
			inline: ['@reduxjs/toolkit', 'react-redux']
		}
	},
	optimizeDeps: {
		include: ['@reduxjs/toolkit', 'react-redux']
	}
}
