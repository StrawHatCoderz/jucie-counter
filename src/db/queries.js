export const insertNewCustomer = (
	first_name,
	last_name,
	email,
	phone_number
) => ({
	query: `INSERT INTO customer(first_name, last_name, email, phone_number) 
         VALUES($1, $2, $3, $4)`,
	values: [first_name, last_name, email, phone_number],
});

export const insertNewSupplier = (supplier_name, contact_number, email) => ({
	query: `INSERT INTO supplier(supplier_name, contact_number, email) 
         VALUES($1, $2, $3)`,
	values: [supplier_name, contact_number, email],
});

export const getProductPrice = (productId) => ({
	query: `SELECT item_price FROM menu WHERE item_id = $1`,
	values: [productId],
});

export const insertNewOrder = (customer_id) => ({
	query: `INSERT INTO orders(customer_id, order_date) 
         VALUES($1, NOW()) RETURNING order_id`,
	values: [customer_id],
});

export const insertOrderedItem = (order_id, product_id, quantity, price) => ({
	query: `INSERT INTO ordered_items(order_id, item_id, quantity, price_at_purchase) 
         VALUES($1, $2, $3, $4)`,
	values: [order_id, product_id, quantity, price],
});

export const TRANSACTIONS = {
	begin: `BEGIN`,
	commit: `COMMIT`,
	rollback: `ROLLBACK`,
};

export const deductRawMaterialsForOrder = (order_id) => ({
	query: `
    UPDATE raw_material rm
    SET current_stock = rm.current_stock - r.required_quantity
    FROM recipe r
    JOIN ordered_items oi USING(item_id)
    WHERE oi.order_id = $1 AND rm.ingredient_id = r.ingredient_id
  `,
	values: [order_id],
});

export const markOrderCompleted = (order_id) => ({
	query: `
    UPDATE ordered_items
    SET order_status = 'COMPLETED'
    WHERE order_id = $1;
  `,
	values: [order_id],
});
