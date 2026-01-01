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

	const expected = {
		query: `INSERT INTO customer(first_name, last_name, email, phone_number) 
         VALUES($1, $2, $3, $4)`,
		values: ['Hawk', 'Eye', 'hawkEye@shiled.com', '8923222'],
	};

	assertEquals(actual, expected);
});

Deno.test('insertNewSupplier: insert new supplier', () => {
	const actual = insertNewSupplier(
		'HL Milk Products',
		'31256745',
		'hmmilkproducts@boys.com'
	);

	const expected = {
		query: `INSERT INTO supplier(supplier_name, contact_number, email) 
         VALUES($1, $2, $3)`,
		values: ['HL Milk Products', '31256745', 'hmmilkproducts@boys.com'],
	};

	assertEquals(actual, expected);
});

Deno.test('getProductPrice: get product price using id', () => {
	const actual = getProductPrice(1);

	const expected = {
		query: `SELECT item_price FROM menu WHERE item_id = $1`,
		values: [1],
	};

	assertEquals(actual, expected);
});

Deno.test('insertOrder: insert new order', () => {
	const actual = insertNewOrder(1);

	const expected = {
		query: `INSERT INTO orders(customer_id, order_date) 
         VALUES($1, NOW()) RETURNING order_id`,
		values: [1],
	};

	assertEquals(actual, expected);
});

Deno.test('insertOrderedItem: insert ordered item details', () => {
	const actual = insertOrderedItem(4, 1, 2, 35);

	const expected = {
		query: `INSERT INTO ordered_items(order_id, item_id, quantity, price_at_purchase) 
         VALUES($1, $2, $3, $4)`,
		values: [4, 1, 2, 35],
	};

	assertEquals(actual, expected);
});
