import {
	getProductPrice,
	insertNewCustomer,
	insertNewSupplier,
	insertNewOrder,
	insertOrderedItem,
	deductRawMaterialsForOrder,
	markOrderCompleted,
	TRANSACTIONS,
	insertMenuItem,
	insertRawMaterial,
	insertNewBatchesIntoInventory,
	updateNewStockIntoRawMaterials,
	insertRecipe,
} from './queries.js';

const displayFeedback = (process, table) => {
	console.log(`${table}: Sucuessfully ${process}`);
};

const handleError = (error) => {
	console.error(`Query failed, ${error}`);
};

export const insertCustomer = (
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
	return database
		.queryArray(query, values)
		.then(() => displayFeedback('INSERTED Values', 'customer'))
		.catch((error) => handleError(error));
};

export const insertSupplier = (
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
	return database
		.queryArray(query, values)
		.then(() => displayFeedback('INSERTED Values', 'supplier'))
		.catch((error) => handleError(error));
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
		.then(() => displayFeedback('CREATED order', 'order'))
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
		.then(() => displayFeedback('PROCESSED order', 'order'))
		.then(() => database.queryArray(TRANSACTIONS.commit))
		.catch(rollbackAndHandleError(database, 'Processing Order'));
};

export const addNewRawMaterial = (database, name, unit_type) => {
	const { query, values } = insertRawMaterial(name, unit_type);
	return database
		.queryArray(query, values)
		.then(() => displayFeedback('INSERTED Values', 'raw materials'))
		.catch((error) => handleError(error));
};

const addNewInventoryBatch = async (database, batches) => {
	const { query, values } = insertNewBatchesIntoInventory(batches);
	const result = await database.queryArray(query, values);
	return result.rows.flatMap((x) => x);
};

const addStockIntoRawMaterials = async (database, batchIds) => {
	for (const batchId of batchIds) {
		const { query, values } = updateNewStockIntoRawMaterials(batchId);
		await database.queryArray(query, values);
	}
};

export const processInventory = (database, batches) =>
	database
		.queryArray(TRANSACTIONS.begin)
		.then(() => addNewInventoryBatch(database, batches))
		.then((batchIds) => addStockIntoRawMaterials(database, batchIds))
		.then(() => displayFeedback('PROCESSED Inventory', 'Inventory'))
		.then(() => database.queryArray(TRANSACTIONS.commit))
		.catch(rollbackAndHandleError(database, 'Processing Inventory'));

const addMenuItem = async (database, { name, type, price }) => {
	const { query, values } = insertMenuItem(name, type, price);
	const result = await database.queryArray(query, values);
	return result.rows[0][0];
};

const addRecipe = async (database, { ingredients_needed }, itemId) => {
	const { query, values } = insertRecipe(ingredients_needed, itemId);
	await database.queryArray(query, values);
};

export const addNewMenuItem = (database, menuItem) =>
	database
		.queryArray(TRANSACTIONS.begin)
		.then(() => addMenuItem(database, menuItem))
		.then((itemId) => addRecipe(database, menuItem, itemId))
		.then(() => displayFeedback('INSERTED values', 'menu'))
		.then(() => database.queryArray(TRANSACTIONS.commit))
		.catch(rollbackAndHandleError(database, 'Adding Menu'));
