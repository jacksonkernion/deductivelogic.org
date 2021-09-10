<script>

    import AuthModal from "$lib/components/modal-forms/AuthModal.svelte";
    import supabase from '$lib/db';

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

    import ProblemForm from '$lib/components/ProblemForm.svelte';
    import {problemTypes} from '$lib/constants.js';

    export let user;

    let problems = [
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
            "logStr1": "(p <> q) <> r",
            "logStr2": "p . -q | -p . r",
            "logStrSet": null,
            "sentSet": null
        },
        {
            "number": 5,
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
            "number": 6,
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
            "number": 7,
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
            "number": 8,
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
            "number": 9,
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
        else if(problem.type === 'quantInterp'){
            problem.component = QuantInterp;
        }

        return problem;
    });

    let newProblem = {
        number: problems.length + 1,
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

<div class="bg-near-white bb b--black-10">

    <div class="cf mw7 center ph4">
        <div class="ttu lh-title f7 fw6 tracked mv3 pt1 tl black-80 dib v-mid">deductivelogic.org</div>
        <div class="fr dib v-mid">
            <AuthModal {user} />     
        </div>
    </div>

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
        {#each problems as problem}
            <svelte:component this={problem.component} {...problem}/>
        {/each}
    </ul>

    <div class="w-75">
        <h3 class="f5 fw5 mt4">Add Problem</h3>

        <div class="measure">
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
            <ProblemForm bind:problem={newProblem} on:click={createProblem}/>
        {/if}
    </div>



</div>





