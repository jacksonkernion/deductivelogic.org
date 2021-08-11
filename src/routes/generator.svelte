<script>

    import ProblemForm from '$lib/components/ProblemForm.svelte';

    import {problemTypes} from '$lib/problemTypes.js';

    let newProblem = {
        type: 'none'
    };

    function updateNewProblem() {
        for(var attr in problemTypes[newProblem.type].attributes){
            newProblem[attr] = '';
        }
    }

</script>

<div class="bg-washed-green bb b--green bw1">

    <div class="mw7 pa4 center pb4 dark-green">
        <div class="lh-title f3 fw6 pt6 pb2">Generator</div>
    </div>

</div>

<div class="mw7 center pa4">
    <p class='f5'>Problem Type</p>
    <!-- svelte-ignore a11y-no-onchange -->
    <select name="problemType" bind:value={newProblem.type} on:change={updateNewProblem}>
        <option value="none"></option>
        {#each Object.entries(problemTypes) as [shorthand, prob]}
            <option value="{shorthand}">{prob.description}</option> 
        {/each}
    </select>

    {#if newProblem.type!='none'}
        <ProblemForm bind:problem={newProblem}/>
    {/if}
</div>


