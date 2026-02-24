export const insertNewCustomer = ({
	firstName,
	lastName,
	email,
	phoneNumber,
}) => ({
	query: `INSERT INTO customer(first_name, last_name, email, phone_number)
         VALUES($1, $2, $3, $4)`,
	values: [firstName, lastName, email, phoneNumber],
});

export const insertNewSupplier = ({ supplierName, contactNumber, email }) => ({
	query: `INSERT INTO supplier(supplier_name, contact_number, email)
         VALUES($1, $2, $3)`,
	values: [supplierName, contactNumber, email],
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

export const insertMenuItem = (name, type, price) => ({
	query: `INSERT INTO menu(item_name,item_type,item_price) VALUES($1, $2, $3) RETURNING item_id`,
	values: [name, type, price],
});

export const insertRawMaterial = (name, unit_type) => ({
	query: `INSERT INTO raw_material(ingredient_name, unit_type) VALUES($1, $2);`,
	values: [name, unit_type],
});

export const insertNewBatchesIntoInventory = (batches) => {
	const placeholders = batches.map((_, index) => {
		const offset = index * 5;
		return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${
			offset + 4
		}, CURRENT_DATE + ($${offset + 5} || ' days')::interval)`;
	});

	const values = batches.flatMap((batch) => [
		batch.ingredient_id,
		batch.supplier_id,
		batch.quantity_received,
		batch.cost_price,
		batch.expiry_date,
	]);

	const query = `
    INSERT INTO inventory_batch (
      ingredient_id,
      supplier_id,
      quantity_received,
      cost_price,
      expiry_date
    )
    VALUES ${placeholders.join(', ')}
		RETURNING batch_id
  `;

	return { query, values };
};

export const updateNewStockIntoRawMaterials = (batch_id) => ({
	query: `
    UPDATE raw_material rm
		SET current_stock = rm.current_stock + ib.quantity_received
		FROM inventory_batch ib
		WHERE rm.ingredient_id = ib.ingredient_id
  	AND ib.batch_id = $1;
  `,
	values: [batch_id],
});

export const insertRecipe = (ingredients_needed, itemId) => {
	const placeholders = [];
	const values = [];

	ingredients_needed.forEach(({ id, quantity }, index) => {
		const offset = index * 3;
		placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3})`);
		values.push(itemId, id, quantity);
	});

	return {
		query: `INSERT INTO recipe (item_id, ingredient_id, required_quantity)
            VALUES ${placeholders.join(', ')};`,
		values,
	};
};

export const getAllCustomersQuery = () => ({
	query: `SELECT customer_id, first_name, last_name, email, phone_number FROM customer ORDER BY customer_id ASC`,
	values: [],
});

export const getAllOrdersQuery = () => ({
	query: `
        SELECT
            o.order_id,
            c.first_name || ' ' || c.last_name as customer_name,
            o.order_date,
            COUNT(oi.item_id) as total_items,
            SUM(oi.quantity * oi.price_at_purchase) as total_price,
            MAX(oi.order_status) as status
        FROM orders o
        JOIN customer c ON o.customer_id = c.customer_id
        JOIN ordered_items oi ON o.order_id = oi.order_id
        GROUP BY o.order_id, c.customer_id, o.order_date
        ORDER BY o.order_date DESC
    `,
	values: [],
});

export const getAllRawMaterialsQuery = () => ({
	query: `SELECT ingredient_id, ingredient_name, unit_type, current_stock FROM raw_material ORDER BY ingredient_id`,
	values: [],
});

export const getProductsQuery = () => ({
	query: `SELECT * FROM menu ORDER BY item_id;`,
	values: [],
});

export const getCustomerDetailsQuery = (customerId) => ({
	query: `SELECT * FROM customer WHERE customer_id = $1`,
	values: [customerId],
});
