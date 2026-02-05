import {
	addNewMenuItem,
	addNewRawMaterial,
	createOrder,
	getCustomerDetails,
	getProducts,
	getRawMaterials,
	insertCustomer,
	insertSupplier,
	listCustomers,
	listOrders,
	processInventory,
	processOrder,
} from './handlers.js';

const BATCHES = [
	{
		ingredient_id: 7,
		supplier_id: 3,
		quantity_received: 2000,
		cost_price: 140,
		expiry_date: 20,
	},
	{
		ingredient_id: 9,
		supplier_id: 1,
		quantity_received: 50,
		cost_price: 200,
		expiry_date: 6,
	},
];

const NEW_MENU_ITEM = {
	name: 'Sapota',
	type: 'JUICE',
	price: 30.0,
	ingredients_needed: [
		{ id: 9, quantity: 1 },
		{ id: 3, quantity: 0.002 },
	],
};

const customer = {
	firstName: 'Hawk',
	lastName: 'Eye',
	email: 'hawkEye@shield.com',
	phoneNumber: '123123123',
};

const supplier = {
	supplierName: 'HL Milk Products',
	contactNumber: '31256745',
	email: 'hmmilkproducts@boys.com',
};

const orders = [
	{ id: 1, quantity: 1 },
	{ id: 2, quantity: 1 },
];

export const testDB = async (client) => {
	await insertCustomer(client, customer);
	await insertSupplier(client, supplier);
	await createOrder(client, 1, orders);
	await processOrder(client, 4);
	await addNewRawMaterial(client, 'Sapota', 'UNIT');
	await processInventory(client, BATCHES);
	await addNewMenuItem(client, NEW_MENU_ITEM);

	const products = await getProducts(client);
	console.log('products available:', products.products.length);

	const customers = await listCustomers(client);
	console.log('customers available:', customers.customers.length);

	const customerDetails = await getCustomerDetails(client, 2);
	console.log('customer - firstName: ', customerDetails.customer.first_name);

	const allOrders = await listOrders(client);
	console.log('all orders: ', allOrders.orders.length);

	const rawMaterial = await getRawMaterials(client);
	console.log('raw materials available:', rawMaterial.rawMaterials.length);
};
