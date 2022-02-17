<script context="module">

    import supabase from "$lib/db";
    import { problems, connectives} from '$lib/stores.js';

    export async function load({page, session }) {

        const { user } = session;
        let res;
        
        if(!user.guest){
            res = await supabase
                    .from('courses')
                    .select('*, problemSets(*, problems(*, questions(*, replies(*)), submissions(*)))')
                    .eq('slug', page.params.courseSlug)
                    .eq("problemSets.number", page.params.num)
                    .eq("problemSets.problems.submissions.user_id", user.id)
                    .eq("problemSets.problems.submissions.verdict", "correct")
                    .single();
        }
        else{
            res = await supabase
                    .from('courses')
                    .select('*, problemSets(*, problems(*, questions(*, replies(*))))')
                    .eq('slug', page.params.courseSlug)
                    .eq("problemSets.number", page.params.num)
                    .single();
        }
        if(!res.error){

            const course = res.data;
            const problemSet = course.problemSets[0];

            if(!problemSet){
                        return {
                    status: 404,
                    error: new Error('No problem sets match this URL.')
                };
            }
            
            problems.set(problemSet.problems.sort((a, b) => {
                return problemSet.problemsOrder.indexOf(a.id) - problemSet.problemsOrder.indexOf(b.id)
            }));
            connectives.set(course.connectives);

            return {
                props: {
                    course,
                    problemSet
                }
            };
        }
        

        return {
            status: 404,
            error: new Error('No problem sets match this URL.')
        };
    }
</script>
<script>
    import { session } from "$app/stores";
    import AddProblem from '$lib/components/AddProblem.svelte';
    import Problem from '$lib/components/Problem.svelte';

    export let course = {problemSets:[], admins: []};
    export let problemSet = {name: ''};

    const isAdmin = course.admins.includes($session.user.id) ? true : false;


</script> 

<div class="mw7 center pa4">
    <div class="ml3 ml0-ns lh-title f3 fw4">{problemSet.name}</div>
</div>


<div class="mw7 center ph4 pb2">
    <div class="divider ml3 ml0-ns "></div>
    <ul class="list pl0 ma0"> 
        {#if $problems.length > 0}
            {#each $problems as problem, i (problem.id)}
                {#key problem}
                    <Problem
                        {problem} 
                        number={i+1} 
                        {isAdmin} 
                    />
                {/key}
            {/each}
        {:else}
            <li class="lh-copy w-75-ns mt3 pv6 ba br2 b--black-10 v-mid cf black-40 bg-near-white tc">
                <p class="dib f4 fw4 pv2 ma0">No Problems</p>
            </li>
        {/if}
    </ul>


    {#if isAdmin}
        <AddProblem bind:problemSet />
    {/if}

</div>



