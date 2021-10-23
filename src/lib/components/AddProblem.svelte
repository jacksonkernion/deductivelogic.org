<script>
    import ProblemForm from '$lib/components/ProblemForm.svelte';
    import supabase from "$lib/db";
    import {problemTypes} from '$lib/constants.js';
    import { problems } from '$lib/stores.js';

    export let problemSet = {id: null, problemsOrder: []};
    export let mode = 'pSet';

    let newProblem = {
        type: 'none'
    };

    function updateNewProblem() {
        for(var attr in problemTypes[newProblem.type].attributes){
            if(attr=='logStrSet' || attr=='sentSet')
                newProblem[attr] = [''];
            else
                if(attr = 'answer')
                    newProblem.logStr = '';
                else
                    newProblem[attr] = '';
        }
    }

    function createWelcomeProblem() {
        //ADD ERROR CHECKING...
        $problems = [...$problems, {...newProblem, submissions:[], questions:[]}];
        
        newProblem = {
            type: 'none'
        };
    }

    async function createProblem() {

        if(mode == 'welcome')
            return createWelcomeProblem();
        try {

            newProblem.problemSet_id = problemSet.id;

            const { data, error } = await supabase
                .from('problems')
                .upsert(newProblem);
                
            if (error) throw error;
            if (data){
                $problems = [...$problems, {...data[0], submissions:[], questions:[]}];
                problemSet.problemsOrder = [...problemSet.problemsOrder, data[0].id];
                newProblem = {
                    type: 'none'
                };
            }

            const res2 = await supabase
                .from('problemSets')
                .update({'problemsOrder': problemSet.problemsOrder})
                .eq('id', problemSet.id);
            if (res2.error) throw res2.error;

        } catch (error) {
            alert(error.error_description || error.message);
        }
    }
</script>


<div class="ml3 ml0-ns w-75-ns">
    <h3 class="f5 fw5 mt4">Add Problem</h3>

    <div class="">
        <label for="problemType" class="f6 fw5 db mb2">Select problem type</label>
        <!-- svelte-ignore a11y-no-onchange -->
        <select name="problemType" bind:value={newProblem.type} on:change={updateNewProblem}>
            <option value="none"></option>
            {#each Object.entries(problemTypes) as [shorthand, prob]}
                <option value="{shorthand}">{prob.description}</option> 
            {/each}
        </select>
    </div>

    {#if newProblem.type!='none'}
        <form on:submit|preventDefault={createProblem}>
            <ProblemForm bind:problem={newProblem} on:click={createProblem}/>
            <button class="fr mt4 f6 br2 ba ph3 pv2 mb2 black" type="submit">Add Problem</button>
        </form>
    {/if}
</div>

