<script>

    import { courses } from '$lib/stores.js';
    import supabase from "$lib/db";
    import Input from '$lib/components/atoms/Input.svelte';
    import Modal from '$lib/jui-components/Modal.svelte';

    export let defaultNumber = 1;
    export let courseId;
    export let problemSet = {
        name: null,
        number: defaultNumber,
        description: null,
        dueDate: null,
        published: false,
        course_id: courseId,
        problemsOrder: []
    };

    let modalShow;
    
    async function upsertProblemSet() {
        try {

            const { data, error } = await supabase
                .from('problemSets')
                .upsert([problemSet]);
                
            if (error) throw error;
            if (data){
                let courseIndex = $courses.findIndex(c => c.id === courseId)
                $courses[courseIndex].problemSets = [...$courses[courseIndex].problemSets, {...data[0], correctSubmissions: 0, problems: []} ];
                toggleModal();
                problemSet = {
                    name: null,
                    number: defaultNumber,
                    description: null,
                    dueDate: null,
                    published: false,
                    course_id: courseId,
                    problemsOrder: []
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