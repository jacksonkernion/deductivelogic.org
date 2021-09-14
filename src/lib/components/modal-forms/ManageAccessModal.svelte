<script>
    import supabase from "$lib/db";
    import Modal from '$lib/jui-components/Modal.svelte';
    import { session } from "$app/stores";
    import Label from "$lib/components/atoms/Label.svelte";
    import Button from "$lib/components/atoms/Button.svelte";

    export let course = {};
    export let userProfiles = [];
    let adminIds = [];
    let userIds = [];

    let user = $session.user;

    let modalShow;
    let loading = false;

    function addAdmin(userId){
        adminIds = [...adminIds, userId];
    }

    function removeAdmin(userId){
        adminIds = adminIds.filter(adminId => adminId != userId);
    }

    function removeUser(userId){
        userIds = userIds.filter(id => id != userId);
        removeAdmin(userId);
    }

    function addUser(userId){
        userIds = [...userIds, userId];
    }

    async function updateUsers(){
        try {
            loading = true;
            
            //nor upserting whole course object because I've added userProfiles array, which doen't exist in DB table
            const res1 = await supabase
                .from('courses')
                .update({'admins': adminIds, 'users': userIds})
                .eq('id', course.id);
            if (res1.error) throw res1.error;

        } catch (error) {
            alert(error.error_description || error.message);
        }
        finally{
            modalShow = !modalShow;
            course.admins = adminIds;
            course.users = userIds;
            course.userProfiles = course.userProfiles.filter(profile => userIds.includes(profile.id));
            loading = false;
        }
    }

  function toggleModal() {
    modalShow = !modalShow;
    adminIds = course.admins;
    userIds = course.users;
  } 

</script>

<Button icon="people" on:click={toggleModal}></Button>

{#if modalShow}

<form on:submit|preventDefault={updateUsers}>
<Modal title="Manage Access" confirmText="Save" bind:modalShow>
  
    <ul class="list pl0 mh0 mt0">
    
    {#each userProfiles as profile}
        <li class="lh-copy pv2 bb b--black-10 v-mid cf">
            <div class="fl">
                <p class="dib f6 pv2 ma0">
                    {#if userIds.includes(profile.id)}
                        {profile.lastName}, {profile.firstName} 
                        {#if profile.email}
                            <span class="black-50">・ {profile.email}</span> 
                        {/if}
                        {#if adminIds.includes(profile.id)}
                            <span class="ml2"></span><Label>Admin</Label>
                        {/if}
                    {:else}
                        <del class="black-40">
                            {profile.lastName}, {profile.firstName} 
                            {#if profile.email}
                                <span class="black-50">・ {profile.email}</span> 
                            {/if}
                            {#if adminIds.includes(profile.id)}
                                <span class="ml2"></span><Label>Admin</Label>
                            {/if}
                        </del>
                    {/if}
                </p>
            </div>
            <div class="fr black-50">
                {#if adminIds.includes(profile.id)}
                    <Button icon="key" active=true on:click={removeAdmin(profile.id)}></Button>
                {:else}
                    <Button icon="key" on:click={addAdmin(profile.id)}></Button>
                {/if}
                {#if userIds.includes(profile.id)}
                    <Button icon="person-remove" on:click={removeUser(profile.id)} disabled={profile.id == user.id}></Button>
                {:else}
                    <Button icon="person-add" on:click={addUser(profile.id)}></Button>
                {/if}
            </div>
        </li>
    {/each}
    
    </ul>
  
</Modal>
</form>

{/if}