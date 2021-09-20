
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
import AuthModal from "$lib/components/modal-forms/AuthModal.svelte";

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
  <div class="bg-near-white bb b--black-10">

    <div class="cf mw7 center ph4">
        <a class="logo ttu lh-title f7 fw6 tracked mv3 pt1 tl black-80 dib v-mid" href="/">deductivelogic.org</a>
        <div class="fr dib v-mid">
            <AuthModal user={$session.user} />     
        </div>
    </div>

  </div>
    <slot></slot>
</div>