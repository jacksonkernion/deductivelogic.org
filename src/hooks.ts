import type{ Request } from '@sveltejs/kit'
import supabase from '$lib/db'
import { expressifyReq, expressifyResp, deExpressifyResp } from '$lib/utils/expressify'

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, resolve }: { request: Request, resolve: (request: Request) => Response | Promise<Response> }) {
    // populate the `user` object for all the calls
    let userData = await (await supabase.auth.api.getUserByCookie(expressifyReq(request))).user || {guest: true} // Converts request to have `req.headers.cookie` on `req.cookies, as `getUserByCookie` expects parsed cookies on `req.cookies`
    if(userData && !userData.guest){
        let { data, error, status } = await supabase
            .from('profiles')
            .select(`firstName, lastName, courses`)
            .eq('id', userData.id)
            .single();
        if (error && status !== 406) throw error;
        if (data) {
            userData = {
                ...userData,
                ...data
            };
        }
    }
    request.locals.user = userData;

    //request.locals.token = expressStyleRequest.cookies['sb:token'] || undefined;
    // prepare response
	let response = await resolve(request);
    // Set/Reset authentication cookies for Supabase, when user signs in or signs out
    if (request.method === 'POST' && request.path === '/auth.json') {
        supabase.auth.api.setAuthCookie(request, expressifyResp(response)) // Converts `response` to express compatible format, which Supabase expects for setting headers
        response = deExpressifyResp(response) // Converts response back to its original format
    }

	return {
		...response,
		headers: {
			...response.headers,
			'x-custom-header': 'deductivelogic'
		}
	};
}

export async function getSession(request) {
    const { user } = request.locals
    // only include the properties that are needed client-side — exclude anything else attached to the user like access tokens etc
    // we know that the `user` object won't have anything sensitive so we're making the entire `user` object available
    // Note: `getSession` runs only when SvelteKit server-renders a page, not for the API handlers.
	return {
		user
	};
}