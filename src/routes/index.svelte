<script>
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

    import {demoProblems} from '$lib/problemSets.js';

    let problems = demoProblems.map((problem) => {
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
        else if(problem.type === 'quantInterp'){
            problem.component = QuantInterp;
            problem.interpsRequested = problem.sentSet.split('/');
        }

        if (problem.question)
            problem.sent = problem.question;

        return problem;
    });
</script>

<div class="bg-washed-green bb b--green bw1">

    <div class="mw7 pa4 center pb4 dark-green">
        <div class="lh-title f3 fw6 tracked pt6 pb2">DEDUCTIVELOGIC.ORG v2.0</div>
        <p class="lh-copy f4 fw4">Interactive problem sets for deductive logic courses.<br/>Developed for Harvard's introductory course.</p>
        <p class="lh-copy f4 fw4"><span class="fw5">Example problems below:</span> truth table, truth-functional paraphrase, implication, disjunctive normal form, natural language argument, quantificational paraphrase, quantificational interpretation.</p>
        <p class="lh-copy f4 fw4"><span class="fw5">In progress:</span> deduction problems.</p>
        <p class="lh-copy f4 fw4">Launching Fall 2021.</p>
    </div>

</div>
<div class="mw7 center pa4">
    <ul class="list pl0"> 
        {#each problems as problem}
            <svelte:component this={problem.component} {...problem}/>
        {/each}
    </ul>
</div>





