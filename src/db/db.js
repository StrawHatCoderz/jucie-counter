import { Client } from 'jsr:@db/postgres';
import { initDB } from '../../database/setup/initDb.js';
import {
	addMenuItem,
	createOrder,
	insertCustomer,
	insertSupplier,
	processOrder,
} from './handlers.js';

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
await createOrder(client, 1, [
	{ id: 1, quantity: 1 },
	{ id: 2, quantity: 1 },
]);
await processOrder(client, 4);
await addMenuItem(client, 'Mosambi', 'JUICE', 30);
await client.end();
