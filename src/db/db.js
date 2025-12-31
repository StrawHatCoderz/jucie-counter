import { Client } from 'jsr:@db/postgres';

const client = new Client({
	user: Deno.env.get('PGUSER'),
	password: Deno.env.get('PGPASSWORD'),
	database: Deno.env.get('PGDATABASE'),
	hostname: Deno.env.get('PGHOST'),
	port: Deno.env.get('PGPORT'),
});

await client.connect().then(() => console.log('connected'));

const result = await client.queryObject('SELECT * FROM customer');
console.log(result.rows);

await client.end();
