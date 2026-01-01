export const insertNewCustomer = (first_name, last_name, email, phone_number) =>
	`INSERT INTO customer(first_name, last_name, email, phone_number) VALUES
  ('${first_name}','${last_name}','${email}','${phone_number}')`;

export const insertNewSupplier = (supplier_name, contact_number, email) =>
	`INSERT INTO supplier(supplier_name,contact_number,email) VALUES
  ('${supplier_name}','${contact_number}','${email}')`;

export const getProductPrice = (pIds) =>
	`SELECT item_price FROM menu WHERE item_id = ${pIds}`;

export const insertNewOrder = (customer_id) =>
	`INSERT INTO orders(customer_id, order_date) VALUES(${customer_id},NOW()) RETURNING order_id;`;

export const insertOrderedItem = (order_id, product_id, quantity, price) =>
	`INSERT INTO ordered_items(order_id,item_id,quantity,price_at_purchase) VALUES(${order_id},${product_id},${quantity},${price})`;
