<script context="module">
    import {problemSets} from '$lib/problemSets.js';

    export async function load({ page, fetch, session, context }) {
		let problemSet = problemSets[page.params.num -1];
		return { props: { problemSet }};
        // let num = page.params.num;
		//return { props: { num }};
	}
</script>
<script>

	import {tVal} from '$lib/logic.js';
	import {validity} from '$lib/logic.js';
	import {parseLogStr} from '$lib/logic.js';

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

    export let problemSet = {};
    let problems = [];

    problemSet.problems = problemSet.problems.map((problem) => {
        if(problem.type === 'truthTable')
            problem.component = TruthTable;
        else if(problem.type === 'implication')
            problem.component = Implication;
        else if(problem.type === 'implicationSet')
            problem.component = ImplicationSet;
        else if(problem.type === 'equivalence')
            problem.component = Equivalence;
        else if(problem.type === 'equivalenceSet')
            problem.component = EquivalenceSet;
        else if(problem.type === 'paraphrase')
            problem.component = Paraphrase;
        else if(problem.type === 'natLangArg')
            problem.component = NatLangArg;
        else if(problem.type ==='disjNormForm')
            problem.component = DisjNormForm;
        else if(problem.type === 'quantParaphrase')
            problem.component = null;
        else if(problem.type === 'quantInterp')
            problem.component = null;
        
        return problem;
    });
   
	
</script> 


<h1 class="">Problem Set {problemSet.number}</h1>

<ul class="list pl0 w-75">
    {#each problemSet.problems as problem}
        <svelte:component this={problem.component} {...problem}/>
        <!-- <li>{problem.logStr}</li> -->
    {/each}
</ul>


<style>

</style>