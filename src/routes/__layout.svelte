
<script context="module">
  /*export async function load({ page, fetch, session, context }) {
    return {
      props: {
        session
      }
    }
  }  */
</script>

<script>
	//export const session

import { session } from '$app/stores';
import supabase from '$lib/db';
import { setAuthCookie, unsetAuthCookie } from '$lib/utils/session';

// this should run on every page so I put this code in my `__layout.svelte` file
supabase.auth.onAuthStateChange(async (event, _session) => {
  if (event !== 'SIGNED_OUT') {
    session.set({ user: _session.user });
    await setAuthCookie(_session);
  } else {
    session.set({ user: { guest: true } });
    await unsetAuthCookie();
  }
});

</script>

<div>
    <slot></slot>
</div>