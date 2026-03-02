import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { login } from './handlers/auth_handler.js';
import { serveMenu } from './handlers/menu_handler.js';

const setupDBContext = async (context, next, config) => {
	context.database = config.client;
	await next();
};

export const createApp = (config) => {
	const app = new Hono();

	app.use(logger());
	app.use((context, next) => setupDBContext(context, next, config));

	app.post('/login', login);
	app.get('/menu', serveMenu);
	return app;
};
