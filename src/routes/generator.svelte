<script>

    import supabase from "$lib/db"
    async function insertProblem(prob) {
        let { data, error } = await supabase.from('problems').insert([prob]);
        if (error)
            throw new Error(error.message);  
        return data;
    }

    import MultipleChoice from '$lib/problems/MultipleChoice.svelte';
	import Paraphrase from '$lib/problems/Paraphrase.svelte';
	import TruthTable from '$lib/problems/TruthTable.svelte';
	import Implication from '$lib/problems/Implication.svelte';
	import ImplicationSet from '$lib/problems/ImplicationSet.svelte';
	import Equivalence from '$lib/problems/Equivalence.svelte';
	import EquivalenceSet from '$lib/problems/EquivalenceSet.svelte';
	import Validity from '$lib/problems/Validity.svelte';
	import DisjNormForm from '$lib/problems/DisjNormForm.svelte';
	import NatLangImpSet from '$lib/problems/NatLangImpSet.svelte';
	import NatLangArg from '$lib/problems/NatLangArg.svelte';
    import QuantParaphrase from '$lib/problems/QuantParaphrase.svelte';
    import QuantInterp from '$lib/problems/QuantInterp.svelte';

    import ProblemForm from '$lib/components/ProblemForm.svelte';

    import {problemTypes} from '$lib/problemTypes.js';

    let problems = [];

    $: problems = problems.map((problem) => {
        if(problem.type === 'multipleChoice')
            problem.component = MultipleChoice;
        else if(problem.type === 'paraphrase')
            problem.component = Paraphrase;
        else if(problem.type === 'truthTable')
            problem.component = TruthTable;
        else if(problem.type === 'implication')
            problem.component = Implication;
        else if(problem.type === 'implicationSet')
            problem.component = ImplicationSet;
        else if(problem.type === 'equivalence')
            problem.component = Equivalence;
        else if(problem.type === 'equivalenceSet')
            problem.component = EquivalenceSet;
        else if(problem.type === 'validity')
            problem.component = Validity;
        else if(problem.type === 'natLangImpSet')
            problem.component = NatLangImpSet;
        else if(problem.type === 'natLangArg')
            problem.component = NatLangArg;
        else if(problem.type ==='disjNormForm')
            problem.component = DisjNormForm;
        else if(problem.type === 'quantParaphrase')
            problem.component = QuantParaphrase;
        else if(problem.type === 'quantInterp')
            problem.component = QuantInterp;
        
        return problem;
    });

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

        insertProblem(newProblem);

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
        {#each problems as problem}
            <svelte:component this={problem.component} {...problem}/>
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
        <ProblemForm bind:problem={newProblem} mode='generate' on:click={createProblem}/>
    {/if}
</div>


