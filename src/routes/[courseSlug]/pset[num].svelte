<script context="module">
    import supabase from "$lib/db";

    export async function load({page, session }) {

        const { user } = session;
            
        const res1 = await supabase
            .from('courses')
            .select()
            .eq('slug', page.params.courseSlug)
            .single();

        if(!res1.error){

            const course = res1.data;
            const res2 = await supabase
                .from('problemSets')
                .select()
                .match({course_id: course.id, number: page.params.num})
                .single();
            
            if(!res2.error){
                const problemSet = res2.data;
                const res3 = await supabase
                    .from('problems')
                    .select()
                    .eq('problemSet_id', problemSet.id)
                    .order('number', {ascending: true});
                if(!res3.error){
                    let problems = res3.data;
                    return {
                        props: {
                            user,
                            course,
                            problemSet,
                            problems
                        }
                    };
                }
            }
        }
        
        return {
            status: 404,
            error: new Error('No problem set matches this URL.')
        };
         
    }
</script>
<script>

    import Auth from "$lib/components/Auth.svelte";
    import ProblemForm from '$lib/components/ProblemForm.svelte';
    import {problemTypes} from '$lib/problemTypes.js';

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

    export let user;
    export let course;
    export let problemSet = {};
    export let problems = [];

    let isAdmin = course.admins.includes(user.id) ? true : false;

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

    async function createProblem() {
        try {

            newProblem.problemSet_id = problemSet.id;

            const { data, error } = await supabase
                .from('problems')
                .upsert([newProblem]);
                
            if (error) throw error;
            if (data){
                problems = [...problems, ...data];
                newProblem = {
                    number: newProblem.number + 1,
                    type: 'none'
                };
            }

        } catch (error) {
            alert(error.error_description || error.message);
        }
    }
   
	
</script> 

<div class="bg-near-white bb b--black-10">

    <div class="cf mw7 center ph4">
        <div class="ttu lh-title f7 fw6 tracked mv3 pt1 tl black-80 dib v-mid">deductivelogic.org</div>
        <div class="fr dib v-mid">
            <Auth {user} />     
        </div>
    </div>

    <div class="mw7 center ph4 pt4 pb2">
        <div class="lh-title f3 fw5 pt3 pb2">{problemSet.name}</div>
    </div>

</div>



<div class="mw7 center pa4">
    <ul class="list pl0"> 
        {#if problems.length > 0}
            {#each problems as problem}
                <svelte:component this={problem.component} {...problem}/>
            {/each}
        {:else}
            <li class="lh-copy pv6 ba br2 b--black-10 v-mid cf black-40 bg-near-white tc"><p class="dib f4 fw4 pv2 ma0">No Problems</p></li>
        {/if}
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





