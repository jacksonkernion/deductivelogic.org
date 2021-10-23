<script>

    import supabase from '$lib/db';
    import { session } from "$app/stores";
    import { fly } from 'svelte/transition';
    import { problems } from '$lib/stores';
    
    import QuestionsPanel from '$lib/components/QuestionsPanel.svelte';
    import ProblemForm from '$lib/components/ProblemForm.svelte';
    import Modal from '$lib/jui-components/Modal.svelte'
    import Button from '$lib/components/atoms/Button.svelte';
    
    import MultipleChoice from '$lib/components/problems/MultipleChoice.svelte';
	import Paraphrase from '$lib/components/problems/Paraphrase.svelte';
	import TruthTable from '$lib/components/problems/TruthTable.svelte';
	import Implication from '$lib/components/problems/Implication.svelte';
	import ImplicationSet from '$lib/components/problems/ImplicationSet.svelte';
	import Equivalence from '$lib/components/problems/Equivalence.svelte';
	import EquivalenceSet from '$lib/components/problems/EquivalenceSet.svelte';
	import Validity from '$lib/components/problems/Validity.svelte';
	import DisjNormForm from '$lib/components/problems/DisjNormForm.svelte';
	import NatLangImpSet from '$lib/components/problems/NatLangImpSet.svelte';
	import NatLangArg from '$lib/components/problems/NatLangArg.svelte';
    import QuantParaphrase from '$lib/components/problems/QuantParaphrase.svelte';
    import QuantInterp from '$lib/components/problems/QuantInterp.svelte';

    export let problem = {id: null, type: null, number: null, questions:[], submissions:[]};
    export let number = null, isAdmin = false;
    
    let submission = {
        problem_id: problem.id,
        verdict: '',
        message: '',
    };

    if(problem.submissions.length){
        submission = problem.submissions[problem.submissions.length -1];
    }

    let submitting = false;
    let updatedProblem = JSON.parse(JSON.stringify(problem));
    let editModalShow = false;
    let deleteModalShow = false;
    
    let componentOptions = [
        {type: 'multipleChoice', component: MultipleChoice},
        {type: 'paraphrase', component: Paraphrase},
        {type: 'truthTable', component:TruthTable},
        {type: 'implication', component:Implication},
        {type: 'implicationSet', component:ImplicationSet},
        {type: 'equivalence', component:Equivalence},
        {type: 'equivalenceSet', component:EquivalenceSet},
        {type: 'validity', component:Validity},
        {type: 'natLangImpSet', component:NatLangImpSet},
        {type: 'natLangArg', component:NatLangArg},
        {type: 'disjNormForm', component:DisjNormForm},
        {type: 'quantParaphrase', component:QuantParaphrase},
        {type: 'quantInterp', component:QuantInterp}
    ];
    let component = componentOptions.find(option => option.type == problem.type).component;

    async function logSubmission(verdict, message=null){
        submitting = true;
        if(verdict === 'correct'){
            message = "Solved"
        }
        submission.verdict = verdict;
        submission.message = message;

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
            const updatedDBProblem = JSON.parse(JSON.stringify(updatedProblem));
            delete updatedDBProblem.submissions;
            delete updatedDBProblem.questions;
            
            const { data, error } = await supabase
                .from('problems')
                .upsert([updatedDBProblem]);
                
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
        
        try {

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
<li class="cf">

    {#if isAdmin}
        <div class="ml3 ml0-ns w-75-ns mt1 mb2 pr3 relative z-1">
            <div class="absolute top-0 right-0">
                <Button icon="create-outline" on:click={toggleEditModal}></Button>
                <Button icon="trash-outline" on:click={toggleDeleteModal}></Button>
                <Button icon="chevron-up" disabled={number == 1} on:click={decrementProblem}></Button>
                <Button icon="chevron-down" disabled={number == $problems.length } on:click={incrementProblem}></Button>
            </div>
        </div>
    {/if}

    <div class="fl relative ml3 ml0-ns pv3 pr3 w-75-ns" id="problem{number}">
        <div class="absolute left--2 lh-copy">
            <p>{number}.</p>
        </div>

        <svelte:component this={component} {problem} bind:submission />
        
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
            <button class="f6 br1 ba ph3 pv2 black fr" disabled={submitting} on:click={ () => submission.check()}>{submitting ? "Checking..." : "Check"}</button>
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

    {#if !$session.user.guest}
        <div class="fl w-25-ns">
            <QuestionsPanel bind:questions={problem.questions} problem_id={problem.id} {number} {isAdmin}/>
        </div>
    {/if}

</li>

<div class="divider ml3 ml0-ns w-75-ns"></div>