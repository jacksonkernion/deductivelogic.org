<script>
    import supabase from "$lib/db";
    import {slugify} from "$lib/utils";
    import { courses } from "$lib/stores";
    import { session } from "$app/stores";

    import Input from '$lib/components/Input.svelte';
    import Modal from '$lib/jui-components/Modal.svelte';
    
    export let course = {name: null, slug: null};

    let modalShow;
    let loading = false;

    async function upsertCourse(){
        try {
            loading = true;

            const user = supabase.auth.user();
            
            const res1 = await supabase
                .from('courses')
                .upsert([
                    { name: course.name, slug: slugify(course.name), admins: [user.id] }
                ]);
            if (res1.error) throw res1.error;
            if (res1.data){
                $courses = [...$courses, ...res1.data];
            }

            const res2 = await supabase
                .from('profiles')
                .upsert([
                    { id: user.id, courses: [...$session.user.courses, res1.data[0].id] }
                ]);
            if (res2.error) throw res2.error;
            if (res2.data){
                toggleModal();
                loading = false;
            }

        } catch (error) {
            alert(error.error_description || error.message)
        }
        finally{
            course = {name: null, slug: null};
        }
    }

  function toggleModal() {
    modalShow = !modalShow;
  } 

</script>


<a class="light-silver" on:click={toggleModal}>Create Course...</a>
  
{#if modalShow}

<form on:submit|preventDefault={upsertCourse}>
<Modal title="Create Course" bind:modalShow>
  
      <div>
        <Input label="Course name" bind:value={course.name}/>
      </div>
  
</Modal>
</form>

{/if}

