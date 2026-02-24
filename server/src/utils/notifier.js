export const notifyCentralServer = async (
	userName,
	type,
	action,
	inventoryUpdate = false,
) => {
	const conn = await Deno.connect({ hostname: '127.0.0.1', port: 8080 });
	const payload = JSON.stringify({
		user: userName,
		type: type,
		action: action,
		inventory_update: inventoryUpdate,
		timestamp: new Date().toISOString(),
	});
	await conn.write(new TextEncoder().encode(payload));
	conn.close();
};
