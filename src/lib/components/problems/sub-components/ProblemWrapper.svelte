<script>

    import supabase from '$lib/db';
    import { fly } from 'svelte/transition';
    import { submissions, problems, problemSets} from '$lib/stores';
    import { session } from "$app/stores";
    import ProblemForm from '$lib/components/ProblemForm.svelte';
    import Modal from '$lib/jui-components/Modal.svelte'
    import Button from '$lib/components/atoms/Button.svelte';

    export let problem = {id: null, number: null};
    export let number, isAdmin;
    export let submission = {
        problem_id: problem.id,
        verdict: '',
        message: '',
    };

    let submitting = false;
    let problemSubmissions = $submissions.filter(sub => sub.problem_id == problem.id);
    let updatedProblem = JSON.parse(JSON.stringify(problem));
    let editModalShow = false;
    let deleteModalShow = false;

    if(problemSubmissions.length){
        submission = problemSubmissions[problemSubmissions.length -1];
    }

    async function logSubmission(verdict, message){
        submitting = true;
        submission.verdict = verdict;
        submission.message = message;
        
        // Perhaps I'll ad functionality later, but this is not needed under current functionality
        // $submissions = [...$submissions, {}}];

        submitting = false;

        if(!$session.user.guest){
            try{
                let { error } = await supabase.from('submissions').insert(
                    {
                        // plucking individual properties to ensure no DB collision with old submission'
                        problem_id: problem.id,
                        user_id: $session.user.id,
                        verdict: submission.verdict,
                        message: submission.message,

                    }, {
                    returning: 'minimal', // Don't return the value after inserting
                });

                if (error) throw error;
            } catch (error) {
                alert(error.message);
            }
            
        }
        
    }

    submission.log = logSubmission;

    function toggleEditModal() {
        updatedProblem =JSON.parse(JSON.stringify(problem));
        editModalShow = !editModalShow;
    }

    async function updateProblem(){
        try {
            const { data, error } = await supabase
                .from('problems')
                .upsert([updatedProblem]);
                
            if (error) throw error;
            if (data){
                const index = number-1;
                $problems[index] = updatedProblem;
            }

        } catch (error) {
            alert(error.error_description || error.message);
        }
        finally{
            toggleEditModal();
        }
    }

    function toggleDeleteModal() {
        deleteModalShow = !deleteModalShow;
    }

    async function deleteProblem(){
        const index = number-1;
        const id = problem.id
        const problemSet_id = problem.problemSet_id;
        $problems = [...$problems.slice(0, index), ...$problems.slice(index+1)];
        const problemsOrder = $problems.map(p => p.id);

        for(let i=0; i < $problemSets.length; i++){
            if($problemSets[i].id == problemSet_id){
                $problemSets[i].problemsOrder = problemsOrder;
            }
        }
        

        try {
            const res1 = await supabase
                .from('submissions')
                .delete()
                .eq('problem_id', id);
            if (res1.error) throw res1.error;

            const { data, error } = await supabase
                .from('problems')
                .delete()
                .eq('id', id);
                
            if (error) throw error;

            const res2 = await supabase
                .from('problemSets')
                .update({'problemsOrder': problemsOrder})
                .eq('id', problemSet_id);
                
            if (res2.error) throw res2.error;

        } catch (error) {
            alert(error.error_description || error.message);
        }
        finally{
            toggleDeleteModal();
        }
        
    }

    async function incrementProblem(){
        const oldIndex = number-1;
        $problems = [...$problems.slice(0, oldIndex), $problems[oldIndex+1], problem, ...$problems.slice(oldIndex+2)];
        const problemsOrder = $problems.map(p => p.id);
        
        try {
            const { data, error } = await supabase
                .from('problemSets')
                .update({'problemsOrder': problemsOrder})
                .eq('id', problem.problemSet_id);
                
            if (error) throw error;
            if (data){
                //
            }

        } catch (error) {
            alert(error.error_description || error.message);
        }

    }

    async function decrementProblem(){
        const oldIndex = number-1;
        $problems = [...$problems.slice(0, oldIndex-1), problem, $problems[oldIndex-1], ...$problems.slice(oldIndex+1)];
        const problemsOrder = $problems.map(p => p.id);
        
        try {
            const { data, error } = await supabase
                .from('problemSets')
                .update({'problemsOrder': problemsOrder})
                .eq('id', problem.problemSet_id);
                
            if (error) throw error;
            if (data){
                //
            }

        } catch (error) {
            alert(error.error_description || error.message);
        }

    }

</script>

<style>

    .submission-input{

    }

    .submission-message{
        max-width: 26rem;
        padding: .125rem;
    }
    .submission-message-wrapper{
        padding-top:  .4rem;
    }

</style>

{#if isAdmin}
    <div class="ml3 ml0-ns w-75-ns mt1 mb2 relative z-1">
        <div class="absolute top-0 right-0">
            <Button icon="create-outline" on:click={toggleEditModal}></Button>
            <Button icon="trash-outline" on:click={toggleDeleteModal}></Button>
            <Button icon="chevron-up" disabled={number == 1} on:click={decrementProblem}></Button>
            <Button icon="chevron-down" disabled={number == $problems.length } on:click={incrementProblem}></Button>
        </div>
    </div>
{/if}
<div class="relative dib ml3 ml0-ns pv3 w-75-ns ">
    <div class="absolute left--2 lh-copy">
        <p>{number}.</p>
    </div>
    <div class="lh-copy">
        <slot name="description"></slot>
    </div>
    <!-- <div class="bb b--black-10 "></div> -->
    <div class="submission-input"><slot name="submission-input"></slot></div>
    
    <div class="mt4 mb2 cf">
        {#key submission}
            <!-- This is the styling for a 'solid' submission message box. Thought it too distracting/loud -->
            <!-- <div class="ph3 pv3 mt4 ba br2 b--{color} bg-washed-{color}"> -->
            <div class="fl submission-message-wrapper" in:fly={{ y: -30 }}>
                {#if submission.verdict == 'warn'}
                    <ion-icon name="alert-circle" class="dib v-mid gold"></ion-icon>
                {:else if submission.verdict == 'incorrect'}
                    <ion-icon name="remove-circle" class="dib v-mid red"></ion-icon>
                {:else if submission.verdict == 'correct'}
                    <ion-icon name="checkmark-circle" class="dib v-mid green"></ion-icon>
                {/if}
                <div class="submission-message dib v-mid black-70 f6">{@html submission.message}</div>
            </div>
        {/key}
        <button class="f6 br1 ba ph3 pv2 black fr" disabled={submitting} on:click>{submitting ? "Checking..." : "Check"}</button>
    </div>
</div>

{#if isAdmin}

    {#if editModalShow}

        <form on:submit|preventDefault={updateProblem}>
            <Modal title="Edit Problem" bind:modalShow={editModalShow}>
            
                <ProblemForm bind:problem={updatedProblem} />
            
            </Modal>
        </form>

    {/if}

    {#if deleteModalShow}

        <form on:submit|preventDefault={deleteProblem}>
            <Modal title="Delete Problem" bind:modalShow={deleteModalShow} confirmText="Delete">
            
                Are you sure you want to delete problem {number}?
            
            </Modal>
        </form>

    {/if}
{/if}