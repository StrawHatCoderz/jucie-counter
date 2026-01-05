import {
	createOrder,
	insertCustomer,
	insertSupplier,
	processOrder,
	addNewRawMaterial,
	processInventory,
	addNewMenuItem,
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

export const testDB = async (client) => {
	await insertCustomer(client, 'Hawk', 'Eye', 'hawkEye@shiled.com', '8923222');
	await insertSupplier(
		client,
		'HL Milk Products',
		'31256745',
		'hmmilkproducts@boys.com'
	);
	await createOrder(client, 1, [
		{ id: 1, quantity: 1 },
		{ id: 2, quantity: 1 },
	]);
	await processOrder(client, 4);
	await addNewRawMaterial(client, 'Sapota', 'UNIT');
	await processInventory(client, BATCHES);
	await addNewMenuItem(client, NEW_MENU_ITEM);
};
