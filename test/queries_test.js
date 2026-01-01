import { assertEquals } from '@std/assert';
import { insertNewCustomer } from '../src/db/queries.js';

Deno.test('insertCustomerQuery: insert new customer', () => {
	const actual = insertNewCustomer(
		'Hawk',
		'Eye',
		'hawkEye@shiled.com',
		'8923222'
	);
	const expected = `INSERT INTO customer(first_name, last_name, email, phone_number) VALUES
  ('Hawk','Eye','hawkEye@shiled.com','8923222')
`;
	assertEquals(actual, expected);
});
