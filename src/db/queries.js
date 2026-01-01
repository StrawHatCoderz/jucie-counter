export const insertNewCustomer = (first_name, last_name, email, phone_number) =>
	`INSERT INTO customer(first_name, last_name, email, phone_number) VALUES
  ('${first_name}','${last_name}','${email}','${phone_number}')
`;
