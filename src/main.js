import { Client } from 'jsr:@db/postgres';
import { testDB } from './db/db.js';
import { getProducts } from './db/handlers.js';
import { initDB } from '../database/setup/initDb.js';

export const client = new Client({
	user: Deno.env.get('PGUSER'),
	password: Deno.env.get('PGPASSWORD'),
	database: Deno.env.get('PGDATABASE'),
	hostname: Deno.env.get('PGHOST'),
	port: Deno.env.get('PGPORT'),
});

const displayMenu = (products) => {
	console.log('--- Product Menu ---');
	console.log(
		'Id'.padEnd(5) +
			'Name'.padEnd(20) +
			'Type'.padEnd(10) +
			'Price'.padEnd(10) +
			'Status'
	);
	console.log('-'.repeat(55));

	products.forEach((p) => {
		const id = p.item_id.toString().padEnd(5);
		const name = p.item_name.padEnd(20);
		const type = p.item_type.padEnd(10);
		const price = p.item_price.padEnd(10);
		const status = p.isactive ? 'Available' : 'Not Available';

		console.log(`${id}${name}${type}${price}${status}`);
	});

	console.log('-'.repeat(55));
	console.log(`Total Items: ${products.length}`);
};

await client.connect();
await initDB(client);
await testDB(client);
const menu = await getProducts(client);
displayMenu(menu);

await client.end();
