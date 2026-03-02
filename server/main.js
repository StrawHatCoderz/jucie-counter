import client from './config.js';
import { createApp } from './src/app.js';

const main = () => {
	const app = createApp({ client });
	Deno.serve({ port: 8000 }, app.fetch);
};

main();
