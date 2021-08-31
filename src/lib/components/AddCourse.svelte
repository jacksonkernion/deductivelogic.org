<script>
    //import {user} from "$lib/sessionStore"
    import supabase from "$lib/db";

    import {slugify} from "$lib/helpers.js";

    import Input from '$lib/components/Input.svelte';

    import Modal from '$lib/jui-components/Modal.svelte';
    import { courses, problemSets } from "$lib/stores";
    import { session } from "$app/stores";

    let modalShow;

    export let course = {name: null, slug: null};
  
    let loading = false;

    async function upsertCourse(){
        try {
            loading = true;

            const user = supabase.auth.user();
            
            const req1 = await supabase
                .from('courses')
                .upsert([
                    { name: course.name, slug: slugify(course.name), admins: [user.id] }
                ]);
            if (req1.error) throw error;
            if (req1.data){
                $courses = [...$courses, ...req1.data];
            }

            const req2 = await supabase
                .from('profiles')
                .upsert([
                    { id: user.id, courses: [...$session.user.courses, req1.data[0].id] }
                ]);
            if (req2.error) throw error;
            if (req2.data){
                toggleModal();
                loading = false;
            }

        } catch (error) {
            alert(error.error_description || error.message)
        }
    }

  function toggleModal() {
    modalShow = !modalShow;
  } 

</script>


<button class="mt4 f6 br2 ba ph3 pv2 mb2 black" on:click={toggleModal}>Create Course...</button>
  
{#if modalShow}

<form on:submit|preventDefault={upsertCourse}>
<Modal title="Create Course" bind:modalShow>
  
      <div>
        <Input label="Course name" bind:value={course.name}/>
      </div>
  
</Modal>
</form>

{/if}

