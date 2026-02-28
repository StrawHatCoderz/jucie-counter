import { Hono } from 'hono';
import { logger } from 'hono/logger';

export const createApp = () => {
	const app = new Hono();

	app.use(logger());

	return app;
};
