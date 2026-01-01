export const insertNewCustomer = (first_name, last_name, email, phone_number) =>
	`INSERT INTO customer(first_name, last_name, email, phone_number) VALUES
  ('${first_name}','${last_name}','${email}','${phone_number}')`;

export const insertNewSupplier = (supplier_name, contact_number, email) =>
	`INSERT INTO supplier(supplier_name,contact_number,email) VALUES
  ('${supplier_name}','${contact_number}','${email}')`;
