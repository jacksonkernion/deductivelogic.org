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

	import {parseLogStr, validity, prenexForm, tVal, quantParaphrase} from '$lib/logic.js';

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
            problem.component = null;
        else if(problem.type === 'quantInterp')
            problem.component = null;
        
        return problem;
    });

    //console.log(parseLogStr("Ax[ Tx > Ey(Cy . Pxy) ]"));
    //console.log(prenexForm(parseLogStr("Ax[ Tx > Ey(Cy . Pxy) ]")));
    //console.log(quantParaphrase("Ax[ Tx > Ey(Cy . Pxy) ]", prenexForm(parseLogStr("Ax[ Tx > Ey(Cy . Pxy) ]"))));
    console.log(quantParaphrase("Ax[ Tx > Ey(Cy . Pxy) ]", "Aw[Ez(Tw > (Cz . Pwz)) ]"));
    
    //console.log(tVal(parseLogStr('(Ax)(Ey)(Px . Ryx)'), {domainSize: 4, P1: true, R31: true}));
    //console.log(tVal(parseLogStr('(Ax)(Ey)(Px > Ryx)'), {domainSize: 4, P1: true, R31: true}));
    //console.log(parseLogStr('(Ax)(Ey)(Px . Ryx)'));
   
	
</script> 

<div class="bg-washed-green bb b--green bw1">

    <div class="mw7 pa4 center pb4 dark-green">
        <div class="lh-title f3 fw6 pt6 pb2">Problem Set {problemSet.number}</div>
    </div>

</div>

<div class="mw7 center pa4">
    <ul class="list pl0"> 
        {#each problemSet.problems as problem}
            <svelte:component this={problem.component} {...problem}/>
        {/each}
    </ul>
</div>

<style>

</style>