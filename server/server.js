import { requestHandler } from './src/controllers/request_handler.js';

const main = async () => {
	await Deno.serve({ port: 8000 }, requestHandler);
};

await main();
