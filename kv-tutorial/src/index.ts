/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	USERS_NOTIFICATION_CONFIG: KVNamespace;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		try {
			await env.USERS_NOTIFICATION_CONFIG.put('user_2', 'disabled');
			const value = await env.USERS_NOTIFICATION_CONFIG.get('user_2');
			if (value === null) {
				return new Response('Value not found', { status: 404 });
			}
			return new Response(value);
		} catch (err) {
			console.error(`KV returned error:`, err);
			const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred when accessing KV storage';
			return new Response(errorMessage, {
				status: 500,
				headers: { 'Content-Type': 'text/plain' },
			});
		}
	},
} satisfies ExportedHandler<Env>;
