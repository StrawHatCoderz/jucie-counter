import { getProducts } from '../db/handlers.js';

export const serveMenu = async (context) => {
	const response = await getProducts(context.database);
	if (!response.success) {
		return context.json({ error: response.error });
	}

	return context.json(response.products);
};

export const handleOrder = async (context) => {
	const payload = await context.req.body;
	console.log(payload);
	return context.redirect('/menu');
};
