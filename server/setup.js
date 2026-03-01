import client from './config.js';
import { initDB } from './database/setup/initDb.js';

const setup = async (client) => {
	try {
		console.log('Initializing Database...');
		await client.connect();
		await initDB(client);
		console.log('Database setup complete!');
	} catch (err) {
		console.error('Database setup failed:', err);
	} finally {
		await client.end();
	}
};

await setup(client);
