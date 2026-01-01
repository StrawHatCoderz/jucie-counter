import {
	getProductPrice,
	insertNewCustomer,
	insertNewSupplier,
	insertNewOrder,
	insertOrderedItem,
} from './queries.js';

export const insertCustomer = async (
	database,
	first_name,
	last_name,
	email,
	phone_number
) => {
	const query = insertNewCustomer(first_name, last_name, email, phone_number);
	await database.queryArray(query);
};

export const insertSupplier = async (
	database,
	supplier_name,
	contact_number,
	email
) => {
	const query = insertNewSupplier(supplier_name, contact_number, email);
	await database.queryArray(query);
};

const getPrice = (database, product_id) =>
	database
		.queryArray(getProductPrice(product_id))
		.then((result) => result.rows[0][0])
		.then(Number);

const insertOrder = (database, customer_id) =>
	database
		.queryArray(insertNewOrder(customer_id))
		.then((result) => result.rows[0][0])
		.then(Number);

const insertOrderedItems = async (database, order_id, products) => {
	for (const { id, quantity } of products) {
		const price = await getPrice(database, id);
		await database.queryArray(insertOrderedItem(order_id, id, quantity, price));
	}
};

export const createOrder = async (database, customer_id, products) => {
	const order_id = await insertOrder(database, customer_id);
	await insertOrderedItems(database, order_id, products);
};
