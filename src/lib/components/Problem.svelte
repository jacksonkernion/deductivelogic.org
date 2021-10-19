<script>
    import QuestionsPanel from '$lib/components/QuestionsPanel.svelte';

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

    export let problem = {id: null, number: null};
    export let number, isAdmin;
    export let questions = [];
    export let replies = [];
    
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
    }
</script>

<svelte:component this={problem.component} 
    {problem}
    {number}
    {isAdmin}
/>

<div class="w-20-ns dib">
    <QuestionsPanel problem_id={problem.id} {isAdmin} {questions} {replies} />
</div>

<div class="divider ml3 ml0-ns w-75-ns"></div>