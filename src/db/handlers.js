import { insertNewCustomer, insertNewSupplier } from './queries.js';

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
  console.log(query);
  
	await database.queryArray(query);
};
