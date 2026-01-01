import { assertEquals } from '@std/assert';
import {
	getProductPrice,
	insertNewCustomer,
	insertNewSupplier,
	insertNewOrder,
	insertOrderedItem,
} from '../src/db/queries.js';

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

Deno.test('getProductPrice: get product price using id', () => {
	const actual = getProductPrice(1);
	const expected = `SELECT item_price FROM menu WHERE item_id = 1`;
	assertEquals(actual, expected);
});

Deno.test('insertOrder: insert new  order', () => {
	const actual = insertNewOrder(1);
	const expected = `INSERT INTO orders(customer_id, order_date) VALUES(1,NOW()) RETURNING order_id;`;
	assertEquals(actual, expected);
});

Deno.test('insertOrderedItem: insert ordered item details', () => {
	const actual = insertOrderedItem(4, 1, 2, 35);
	const expected = `INSERT INTO ordered_items(order_id,item_id,quantity,price_at_purchase) VALUES(4,1,2,35)`;
	assertEquals(actual, expected);
});
