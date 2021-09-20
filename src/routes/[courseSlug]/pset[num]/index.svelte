<script context="module">
    import supabase from "$lib/db";
    import { submissions, problems, connectives} from '$lib/stores.js';

    export async function load({page, session }) {

        const { user } = session;
            
        const res1 = await supabase
            .from('courses')
            .select()
            .eq('slug', page.params.courseSlug)
            .single();

        if(!res1.error){

            let course = res1.data;
            connectives.set(course.connectives);
            
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
                    .eq('problemSet_id', problemSet.id);
                if(!res3.error){
                    problems.set(res3.data.sort((a, b) => {return problemSet.problemsOrder.indexOf(a.id) - problemSet.problemsOrder.indexOf(b.id)}));

                    //get and set submissions only if user is logged in
                    // And only get correct ones to show. Incorrect submissions will just reset.
                    if(!user.guest){
                        let problem_ids = problemSet.problemsOrder;
                        const res4 = await supabase
                            .from('submissions')
                            .select()
                            .match({user_id: user.id, verdict: 'correct'})
                            .in('problem_id', problem_ids);
                        if(!res4.error){
                            submissions.set(res4.data);
                        }
                    }

                    return {
                        props: {
                            user,
                            course,
                            problemSet
                        }
                    };
                }
            }
        }
        
        return {
            status: 404,
            error: new Error('No problem sets match this URL.')
        };
         
    }
</script>
<script>

    import AuthModal from "$lib/components/modal-forms/AuthModal.svelte";
    import AddProblem from '$lib/components/AddProblem.svelte';

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

    export let user;
    export let course;
    export let problemSet = {};

    let isAdmin = course.admins.includes(user.id) ? true : false;

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

<div class="bg-near-white bb b--black-10">

    <div class="cf mw7 center ph4">
        <a class="logo ttu lh-title f7 fw6 tracked mv3 pt1 tl black-80 dib v-mid" href="/">deductivelogic.org</a>
        <div class="fr dib v-mid">
            <AuthModal {user} />     
        </div>
    </div>

</div>

<div class="mw7 center pa4">
    <div class="ml3 ml0-ns lh-title f3 fw4">{problemSet.name}</div>
</div>

<div class="mw7 center ph4 pb2">
    <div class="divider ml3 ml0-ns w-75-ns"></div>
    <ul class="list pl0 ma0"> 
        {#if $problems.length > 0}
            {#each $problems as problem, i (problem.id)}
                {#key problem}
                    <svelte:component this={problem.component} {problem} number={i+1} {isAdmin}/>
                {/key}
            {/each}
        {:else}
            <li class="lh-copy w-75-ns mt3 pv6 ba br2 b--black-10 v-mid cf black-40 bg-near-white tc"><p class="dib f4 fw4 pv2 ma0">No Problems</p></li>
        {/if}
    </ul>

    {#if isAdmin}
        <AddProblem bind:problemSet/>
    {/if}

</div>





