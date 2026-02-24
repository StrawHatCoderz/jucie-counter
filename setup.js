import { Client } from '@db/postgres';
import { initDB } from './server/database/setup/initDb.js';
import { testDB } from './server/test/test_db.js';

const client = new Client({
	user: Deno.env.get('PGUSER'),
	password: Deno.env.get('PGPASSWORD'),
	database: Deno.env.get('PGDATABASE'),
	hostname: Deno.env.get('PGHOST'),
	port: Deno.env.get('PGPORT'),
});

try {
	console.log('Initializing Database...');
	await client.connect();
	await initDB(client);
	testDB(client);
	console.log('Database setup complete!');
} catch (err) {
	console.error('Database setup failed:', err);
} finally {
	await client.end();
}
