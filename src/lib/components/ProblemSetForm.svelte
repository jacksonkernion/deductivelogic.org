<script>

    import { problemSets } from '$lib/stores.js';
    import supabase from "$lib/db";
    import Input from '$lib/components/Input.svelte';
    import Modal from '$lib/jui-components/Modal.svelte';

    let modalShow;
    

    export let defaultNumber = 1;
    export let courseId;
    export let problemSet = {
        name: null,
        number: defaultNumber,
        description: null,
        dueDate: null,
        published: true,
        course_id: courseId
    };
    
    async function upsertProblemSet() {
        try {

            const { data, error } = await supabase
                .from('problemSets')
                .upsert([problemSet]);
                
            if (error) throw error;
            if (data){
                $problemSets = [...$problemSets, ...data];
                toggleModal();
                problemSet = {
                    name: null,
                    number: defaultNumber,
                    description: null,
                    dueDate: null,
                    published: true,
                    course_id: courseId
                };
            }

        } catch (error) {
            alert(error.error_description || error.message);
        }
    }

    function toggleModal() {
        modalShow = !modalShow;
    } 
</script>

<button class="mb2 f6 br2 ba ph3 pv2  black" on:click={toggleModal}>New Problem Set</button>

{#if modalShow}

<form on:submit|preventDefault={upsertProblemSet}>
    <Modal title="New Problem Set" bind:modalShow confirmText="Create">
    
        <div>
            <Input label="Name" placeholder={"Problem Set " + defaultNumber } bind:value={problemSet.name}/>
        </div>
    
    </Modal>
</form>

{/if}