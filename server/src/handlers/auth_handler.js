import { setCookie } from 'hono/cookie';
import { findCustomer } from '../db/handlers.js';

const isValidPayload = (...payload) =>
	payload.some((data) => data !== undefined);

export const login = async (context) => {
	const payload = await context.req.formData();
	const { email } = Object.fromEntries(payload);

	if (!isValidPayload(email)) {
		return context.json({ error: 'invalid email' }, 403);
	}

	await context.database.connect();
	const result = await findCustomer(context.database, { email });
	await context.database.end();

	if (!result.success) {
		return context.json({ error: result.error }, 403);
	}

	setCookie(context, 'customer', JSON.stringify(result.customer));

	return context.redirect('/', 303);
};
