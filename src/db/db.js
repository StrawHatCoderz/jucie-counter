import { Client } from 'jsr:@db/postgres';
import { initDB } from '../../database/setup/initDb.js';
import { insertCustomer, insertSupplier } from './handlers.js';

export const client = new Client({
	user: Deno.env.get('PGUSER'),
	password: Deno.env.get('PGPASSWORD'),
	database: Deno.env.get('PGDATABASE'),
	hostname: Deno.env.get('PGHOST'),
	port: Deno.env.get('PGPORT'),
});

await client.connect();
await initDB(client);
await insertCustomer(client, 'Hawk', 'Eye', 'hawkEye@shiled.com', '8923222');
await insertSupplier(
	client,
	'HL Milk Products',
	'31256745',
	'hmmilkproducts@boys.com'
);
await client.end();
