import {
	getProductPrice,
	insertNewCustomer,
	insertNewSupplier,
	insertNewOrder,
	insertOrderedItem,
	deductRawMaterialsForOrder,
	markOrderCompleted,
	TRANSACTIONS,
	addNewMenuItem,
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

const rollbackAndHandleError = (database, process) => (error) => {
	console.error(`Transaction failed in ${process}, rolling back: ${error}`);
	return database.queryArray(TRANSACTIONS.rollback);
};

export const createOrder = (database, customer_id, products) => {
	return database
		.queryArray(TRANSACTIONS.begin)
		.then(() => insertOrder(database, customer_id))
		.then((order_id) => insertOrderedItems(database, order_id, products))
		.then(() => database.queryArray(TRANSACTIONS.commit))
		.catch(rollbackAndHandleError(database, 'Creating Order'));
};

const updateRawMaterials = async (database, order_id) => {
	const { query, values } = deductRawMaterialsForOrder(order_id);
	await database.queryArray(query, values);
};

const updateOrderStatus = async (database, order_id) => {
	const { query, values } = markOrderCompleted(order_id);
	await database.queryArray(query, values);
};

export const processOrder = (database, order_id) => {
	return database
		.queryArray(TRANSACTIONS.begin)
		.then(() => updateRawMaterials(database, order_id))
		.then(() => updateOrderStatus(database, order_id))
		.then(() => database.queryArray(TRANSACTIONS.commit))
		.catch(rollbackAndHandleError(database, 'Processing Order'));
};

export const addMenuItem = async (database, name, type, price) => {
	const { query, values } = addNewMenuItem(name, type, price);
	await database.queryArray(query, values);
};
