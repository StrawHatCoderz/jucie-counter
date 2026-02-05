import {
	deductRawMaterialsForOrder,
	getAllCustomersQuery,
	getAllOrdersQuery,
	getAllRawMaterialsQuery,
	getCustomerDetailsQuery,
	getProductPrice,
	getProductsQuery,
	insertMenuItem,
	insertNewBatchesIntoInventory,
	insertNewCustomer,
	insertNewOrder,
	insertNewSupplier,
	insertOrderedItem,
	insertRawMaterial,
	insertRecipe,
	markOrderCompleted,
	TRANSACTIONS,
	updateNewStockIntoRawMaterials,
} from './queries.js';

const displayFeedback = (process, table) => {
	console.log(`${table}: Successfully ${process}`);
};

export const insertCustomer = async (database, customer) => {
	const { query, values } = insertNewCustomer(customer);
	try {
		const result = await database.queryObject(query, values);
		displayFeedback('INSERTED Values', 'customer');
		return { success: true, id: result };
	} catch (error) {
		return { success: false, error };
	}
};

export const insertSupplier = async (database, supplier) => {
	const { query, values } = insertNewSupplier(supplier);
	try {
		const result = await database.queryArray(query, values);
		displayFeedback('INSERTED Values', 'supplier');
		return { success: true, id: result };
	} catch (error) {
		return { success: true, error };
	}
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
	try {
		await database.queryArray(TRANSACTIONS.begin);
		const order_id = await insertOrder(database, customer_id);
		await insertOrderedItems(database, order_id, products);
		await database.queryArray(TRANSACTIONS.commit);

		displayFeedback('CREATED order', 'orders');
		return { success: true, id: order_id };
	} catch (error) {
		database.queryArray(TRANSACTIONS.rollback);
		return { success: false, error };
	}
};

const updateRawMaterials = async (database, order_id) => {
	const { query, values } = deductRawMaterialsForOrder(order_id);
	await database.queryArray(query, values);
};

const updateOrderStatus = async (database, order_id) => {
	const { query, values } = markOrderCompleted(order_id);
	await database.queryArray(query, values);
};

export const processOrder = async (database, order_id) => {
	try {
		await database.queryArray(TRANSACTIONS.begin);
		await updateRawMaterials(database, order_id);
		await updateOrderStatus(database, order_id);
		await database.queryArray(TRANSACTIONS.commit);
		displayFeedback('PROCESSED order', 'orders');
		return { success: true, id: order_id };
	} catch (error) {
		await database.queryArray(TRANSACTIONS.rollback);
		return { success: false, error };
	}
};

export const addNewRawMaterial = async (database, name, unit_type) => {
	try {
		const { query, values } = await insertRawMaterial(name, unit_type);
		const result = database.queryArray(query, values);
		displayFeedback('INSERTED Values', 'raw materials');
		return { success: true, id: result };
	} catch (error) {
		return { success: false, error };
	}
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

export const processInventory = async (database, batches) => {
	try {
		await database.queryArray(TRANSACTIONS.begin);
		const batchIds = await addNewInventoryBatch(database, batches);
		await addStockIntoRawMaterials(database, batchIds);
		displayFeedback('PROCESSED Inventory', 'Inventory');
		database.queryArray(TRANSACTIONS.commit);
	} catch (error) {
		database.queryArray(TRANSACTIONS.rollback);
		return { success: false, error };
	}
};

const addMenuItem = async (database, { name, type, price }) => {
	const { query, values } = insertMenuItem(name, type, price);
	const result = await database.queryArray(query, values);
	return result.rows[0][0];
};

const addRecipe = async (database, { ingredients_needed }, itemId) => {
	const { query, values } = insertRecipe(ingredients_needed, itemId);
	await database.queryArray(query, values);
};

export const addNewMenuItem = async (database, menuItem) => {
	try {
		await database.queryArray(TRANSACTIONS.begin);
		const itemId = await addMenuItem(database, menuItem);
		await addRecipe(database, menuItem, itemId);
		displayFeedback('INSERTED values', 'menu');
		await database.queryArray(TRANSACTIONS.commit);
	} catch (error) {
		database.queryArray(TRANSACTIONS.rollback);
		return { success: false, error };
	}
};

export const getProducts = async (database) => {
	try {
		const { query } = getProductsQuery();
		const result = await database.queryObject(query);
		return { success: true, products: result.rows };
	} catch (error) {
		return { success: false, error };
	}
};

export const getCustomerDetails = async (database, customer_id) => {
	try {
		const { query, values } = getCustomerDetailsQuery(customer_id);
		const result = await database.queryObject(query, values);

		return { success: true, customer: result.rows[0] };
	} catch (error) {
		return { success: false, error };
	}
};

export const listCustomers = async (database) => {
	try {
		const { query } = getAllCustomersQuery();
		const result = await database.queryObject(query);
		return { success: true, customers: result.rows };
	} catch (error) {
		return { success: false, error };
	}
};

export const listOrders = async (database) => {
	try {
		const { query } = getAllOrdersQuery();
		const result = await database.queryObject(query);
		return { success: true, orders: result.rows };
	} catch (error) {
		return { success: false, error };
	}
};

export const getRawMaterials = async (database) => {
	try {
		const { query } = getAllRawMaterialsQuery();
		const result = await database.queryObject(query);
		return { success: true, rawMaterials: result.rows };
	} catch (error) {
		return { success: false, error };
	}
};
