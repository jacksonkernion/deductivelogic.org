<script>

    import AuthModal from "$lib/components/modal-forms/AuthModal.svelte";

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

    import AddProblem from "./components/AddProblem.svelte";
    import { problems } from '$lib/stores.js';

    export let user;

    $problems = [
        {
            "number": 1,
            "type": 'truthTable',
            "question": null,
            "answer": null,
            "logStr": "p | r <> q | r",
            "logStr1": null,
            "logStr2": null,
            "logStrSet": null,
            "sentSet": null
        },
        {
            "number": 2,
            "type": 'truthTable',
            "question": null,
            "answer": null,
            "logStr": "-p | q <> (p > r)",
            "logStr1": null,
            "logStr2": null,
            "logStrSet": null,
            "sentSet": null
        },
        {
            "number": 3,
            "type": "paraphrase",
            "sent": "If Serbia is forced to submit, then Austria-Hungary will control the Balkans and threaten Constantinople if and only if England does not intervene.",
            "answer": null,
            "logStr": "p > (q . r <> -s)",
            "logStr1": null,
            "logStr2": null,
            "logStrSet": null,
            "sentSet": null
        },
        {
            "number": 4,
            "type": "implication",
            "question": null,
            "answer": null,
            "logStr": null,
            "logStr1": "p <> q <> r",
            "logStr2": "p . -q | -p . r",
            "logStrSet": null,
            "sentSet": null
        },
        {
            "number": 5,
            "type": "equivalence",
            "question": null,
            "answer": null,
            "logStr": null,
            "logStr1": "p <> q <> r",
            "logStr2": "p . q . r | -p . -q . -r",
            "logStrSet": null,
            "sentSet": null
        },
        {
            "number": 6,
            "type": "disjNormForm",
            "question": null,
            "answer": null,
            "logStr": "(p <> q) . (q <> r)",
            "logStr1": null,
            "logStr2": null,
            "logStrSet": null,
            "sentSet": null
        },
        {
            "number": 7,
            "type": "natLangArg",
            "sent": "Therefore, Smith was the murderer.",
            "answer": null,
            "logStr": "q",
            "logStr1": null,
            "logStr2": null,
            "logStrSet": ["-p > q | r", "-q > -p . s","s > q | r"],
            "sentSet": ["If Jones did not meet Smith last night, then either Smith was the murderer or Jones is lying.","If Smith wasn't the murderer, then Jones did not meet Smith last night and the murder took place after midnight.","If the murder took place after midnight, then either Smith was the murderer or Jones is lying."]
        },
        {
            "number": 8,
            "type": "quantParaphrase",
            "sent": "There are sopranos who respect only those tenors who are louder than they.",
            "answer": null,
            "logStr": "(Ex)(Sx . (Ay)(Ty . Rxy > Lyx))",
            "logStr1": null,
            "logStr2": null,
            "logStrSet": null,
            "sentSet": ['S = "(1) is a soprano"','T = "(1) is a tenor"','L = "(1) is louder than (2)"','R = "(1) respects (2)"']
        },
        {
            "number": 9,
            "type": "quantInterp",
            "question": null,
            "answer": null,
            "logStr": "(Ax)(Fx > (Gx <> Hx)) . -(Ax)(Fx . Gx <> Hx) . (Ex)Fx",
            "logStr1": null,
            "logStr2": null,
            "logStrSet": null,
            "sentSet": 'true'
        },
        {
            "number": 10,
            "type": "quantInterp",
            "question": null,
            "answer": null,
            "logStr": "(Ax)(Ay)(Fxy > (Ez)(Fxz . Fyz))",
            "logStr1": null,
            "logStr2": null,
            "logStrSet": null,
            "sentSet": 'true/false'
        },    

    ];
    
    $: $problems = $problems.map((problem) => {
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

        return problem;
    });

</script>

<div class="bg-near-white bb b--black-10 relative top--1">

    <div class="mw7 center pa4">
        <p class="lh-copy f3 fw4 mv4">Interactive problem sets for deductive logic courses.<br/>Developed for Harvard's introductory course.</p>
        <p class="ttu lh-title f6 fw6 tracked ma0 mt3 pb1">Example problems below</p>
        <p class="lh-copy f4 fw4 ma0 black-60">Truth table, truth-functional paraphrase, implication, disjunctive normal form, natural language argument, quantificational paraphrase, quantificational interpretation.</p>
        <p class="ttu lh-title f6 fw6 tracked ma0 mt3 pb1">In progress</p>
        <p class="lh-copy f4 fw4 ma0 black-60">Deduction problems.</p>
    </div>

</div>

<div class="mw7 center ph4 pt4 pb6">
    <ul class="list pl0"> 
        {#each $problems as problem, i}
            <svelte:component this={problem.component} {problem} number={i + 1} isAdmin={false}/>
        {/each}
    </ul>

    <AddProblem mode="welcome"/>

</div>





