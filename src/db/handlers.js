import { insertNewCustomer } from './queries.js';

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
