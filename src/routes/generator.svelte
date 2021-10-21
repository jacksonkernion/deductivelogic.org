<script>

    import supabase from "$lib/db"

    import ProblemForm from '$lib/components/ProblemForm.svelte';
    import Problem from '$lib/components/Problem.svelte';

    import {problemTypes} from '$lib/constants.js';

    let problems = [];

    let newProblem = {
        number: 1,
        type: 'none'
    };

    function updateNewProblem() {
        for(var attr in problemTypes[newProblem.type].attributes){
            if(attr=='logStrSet' || attr=='sentSet')
                newProblem[attr] = [''];
            else
                newProblem[attr] = '';
        }
    }
    function createProblem() {
        //ADD ERROR CHECKING...
        problems = [...problems, newProblem];

        newProblem = {
            number: newProblem.number + 1,
            type: 'none'
        };
    }

</script>

<div class="bg-washed-green bb b--green bw1">

    <div class="mw7 pa4 center pb4 dark-green">
        <div class="lh-title f3 fw6 pt6 pb2">Generator</div>
    </div>

</div>

<div class="mw7 center pa4">

    <ul class="list pl0"> 
        {#each problems as problem, i}
            {#key problem}
                <Problem {problem} number={i+1} isAdmin={true}/>
            {/key}
        {/each}
    </ul>

    <div class="black-80 measure">
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
            <ProblemForm bind:problem={newProblem}/>
            <button class="fr mt4 f6 br2 ba ph3 pv2 mb2 black" type="submit">Add Problem</button>
        </form>
    {/if}
</div>


