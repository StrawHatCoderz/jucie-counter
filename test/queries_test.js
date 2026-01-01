import { assertEquals } from '@std/assert';
import { insertNewCustomer, insertNewSupplier } from '../src/db/queries.js';

Deno.test('insertNewCustomer: insert new customer', () => {
	const actual = insertNewCustomer(
		'Hawk',
		'Eye',
		'hawkEye@shiled.com',
		'8923222'
	);
	const expected = `INSERT INTO customer(first_name, last_name, email, phone_number) VALUES
  ('Hawk','Eye','hawkEye@shiled.com','8923222')`;
	assertEquals(actual, expected);
});

Deno.test('insertNewSupplier: insert new supplier', () => {
	const actual = insertNewSupplier(
		'HL Milk Products',
		'31256745',
		'hmmilkproducts@boys.com'
	);
	const expected = `INSERT INTO supplier(supplier_name,contact_number,email) VALUES
  ('HL Milk Products','31256745','hmmilkproducts@boys.com')`;
	assertEquals(actual, expected);
});
