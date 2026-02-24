const servePage = async (page) => {
	const content = await Deno.readTextFile(`./server/public/html/${page}.html`);

	return new Response(content, {
		status: 200,
		headers: {
			'content-type': 'text/html',
		},
	});
};

const logger = (method, pathname) => {
	console.log(`${method} ${pathname}`);
};

export const requestHandler = async (request) => {
	const { pathname } = new URL(request.url);
	logger(request.method, pathname);

	if (pathname === '/') {
		return await servePage('login');
	}

	if (pathname === '/profile' && request.method === 'GET') {
		return await servePage('profile');
	}

	return new Response('NOT FOUND', {
		status: 404,
	});
};
