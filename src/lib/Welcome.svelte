<script>

    import Auth from "$lib/components/Auth.svelte";
    import supabase from '$lib/db';

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
    import ProblemForm from '$lib/components/ProblemForm.svelte';
    import {problemTypes} from '$lib/problemTypes.js';

    export let user;

    let problems = demoProblems;
    
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
            if(!problem.interpsRequested)
                problem.interpsRequested = problem.sentSet.split('/');
        }

        if (problem.question)
            problem.sent = problem.question;

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
            <Auth {user} />     
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

    <h3 class="f5 fw5 mt4">Add Problem</h3>

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
        <ProblemForm bind:problem={newProblem} on:click={createProblem}/>
    {/if}



</div>





