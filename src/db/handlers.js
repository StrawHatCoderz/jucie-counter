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
	const { query, values } = insertNewCustomer(
		first_name,
		last_name,
		email,
		phone_number
	);
	await database.queryArray(query, values);
};

export const insertSupplier = async (
	database,
	supplier_name,
	contact_number,
	email
) => {
	const { query, values } = insertNewSupplier(
		supplier_name,
		contact_number,
		email
	);
	await database.queryArray(query, values);
};

const getPrice = async (database, product_id) => {
	const { query, values } = getProductPrice(product_id);
	const result = await database.queryArray(query, values);
	return Number(result.rows[0][0]);
};

const insertOrder = async (database, customer_id) => {
	const { query, values } = insertNewOrder(customer_id);
	const result = await database.queryArray(query, values);
	return Number(result.rows[0][0]);
};

const insertOrderedItems = async (database, order_id, products) => {
	for (const { id, quantity } of products) {
		const price = await getPrice(database, id);
		const { query, values } = insertOrderedItem(order_id, id, quantity, price);
		await database.queryArray(query, values);
	}
};

export const createOrder = async (database, customer_id, products) => {
	const order_id = await insertOrder(database, customer_id);
	await insertOrderedItems(database, order_id, products);
};
