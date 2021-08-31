<script lang="ts">

  import type{ AuthSession } from '@supabase/supabase-js';
  import supabase from "$lib/db";
  import {goto} from '$app/navigation';
  import { setAuthCookie, unsetAuthCookie } from '$lib/utils/session';

  async function setServerSessionAndRedir(session: AuthSession) {
      await setAuthCookie(session);
      // goto('/home') - Haven't figured this out, but the session cookie doesn't set properly unless you do a real page refresh.
      window.location = '/home';
  }

  async function signOut() {
    await supabase.auth.signOut();
    await unsetAuthCookie();
    // goto('/') - Haven't figured this out, but the session cookie doesn't set properly unless you do a real page refresh.
    window.location = '/';
  }

  async function signIn() {
    loading = true;

    const { error, session } = await supabase.auth.signIn({email, password});
    if (error) {
        alert(error.message);
    } else {
        setServerSessionAndRedir(session);
    }
    loading = false;
  }

  async function signUp() {
    loading = true;
    const { error, session } = await supabase.auth.signUp({email, password});
    if (error) {
      alert(error.message);
    } else {
      await updateProfile(session.user.id);
      await setAuthCookie(session);
      window.location = '/home';
    }
    loading = false;
  }

  async function updateProfile(userId) {
    try {
      loading = true;
      //const user = supabase.auth.user();

      const updates = {
        //id: user.id,
        id: userId,
        firstName,
        lastName
      };

      let { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      });

      if (error) throw error;

    } catch (error) {
      //alert(error.message);
      //alert('updateProfile: '+ error.message);
      // I am getting an error thrown on signUp(), but not sure why. The profile update goes through and works on page reload?
      // Update: I *think* this is because I am sending upsert request to 'profiles' without client-side cookie being set by supabase
    } finally {
      loading = false;
    }
  }

  async function getProfile() {
    try {
      loading = true;
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`firstName, lastName`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) throw error;

      if (data) {
        //$user.firstName = data.firstName
        //$user.lastName = data.firstName
        firstName = data.firstName;
        lastName = data.lastName;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      loading = false;
    }
  }

/*
  async function signUp(e) {
    const response = await fetch('/signup', {
      method: 'post',
      body: new FormData(e.target)
    })
    if (response.ok) window.location = '/home'
    else alert(await response.text())
  }

  async function signIn(e) {
    const response = await fetch('/signin', {
      method: 'post',
      body: new FormData(e.target)
    })
    //if (response.ok) window.location = '/home'
    //else alert(await response.text())
  }
  */

    import Input from '$lib/components/Input.svelte';
    import Modal from '$lib/jui-components/Modal.svelte';

    export let user;

    let modalShow = false;
  
    let loading = false;
    let firstName;
    let lastName;
    let email;
    let password;

    let isSignIn;

    function signInModal() {
      isSignIn = true;
      modalShow = !modalShow;
    }
    function signUpModal() {
      isSignIn = false;
      modalShow = !modalShow;
    }

    /*
    if(user){
      getProfile();
    }
    */
    
  /*
    const handleSignIn = async () => {
      try {
        loading = true
        const { error } = await supabase.auth.signIn({ email, password })
        if (error) throw error
        //alert('Signed in!')
        modalShow = !modalShow;
      } catch (error) {
        //alert(error.error_description || error.message)
      } finally {
        loading = false
        getProfile();
      }
    }

    const handleSignUp = async () => {
      try {
        loading = true
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        updateProfile();
        modalShow = !modalShow;
      } catch (error) {
        alert(error.error_description || error.message)
      } finally {
        loading = false
      }
    }

  

  export async function signOut() {
    try {
      loading = true
      let { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      //alert(error.message)
    } finally {
      user.set(false);
      loading = false
    }
    
  }
*/

</script>

{#if user.firstName !== undefined}
  <!-- <p>LOGGED IN: </p> -->
  <!-- <p>{firstName} {lastName} ・ -->
  <p class="lh-copy f6">{user.firstName} {user.lastName} ・ 
    <a on:click={signOut}>Sign Out</a>
  </p>
  
{:else}
  <p class="lh-copy f6"><a on:click={signInModal}>Log In</a> ・ <a on:click={signUpModal}>Sign Up</a></p>
{/if}
  
{#if modalShow}

  {#if !isSignIn}
  <form on:submit|preventDefault={signUp}>
    <Modal title="Sign Up" confirmText="Sign Up" bind:modalShow>
      <div>
        <Input label="First name" name="firstName" bind:value={firstName}/>
        <Input label="Last name" name="lastName" bind:value={lastName}/>
        <Input label="Email" name="email" type="email" bind:value={email}/>
        <Input label="Password" name="password" type="password" bind:value={password}/>
      </div>
    </Modal>
  </form>
  {:else }
  <form on:submit|preventDefault={signIn}>
    <Modal title="Log In" confirmText="Log In" bind:modalShow>
      <div>
        <div>
          <Input label="Email" name="email" type="email" bind:value={email}/>
          <Input label="Password" name="password" type="password" bind:value={password}/>
        </div>
      </div>
    </Modal>
  </form>
  {/if}
{/if}

