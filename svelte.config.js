//import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { generateSW } from './pwa.mjs'
import { adapter } from './adapter.mjs'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
		adapter,
		serviceWorker: {
			register: false,
		},
		files: {
			// you don't need to do this if you're using generateSW strategy in your app
			serviceWorker: generateSW ? undefined : 'src/prompt-sw.ts',
		}
	},
  preprocess: vitePreprocess()
};
export default config;
