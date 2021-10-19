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
                    let problem_ids = problemSet.problemsOrder;
                    let questions =[];
                    let replies = [];

                    const res4 = await supabase
                        .from('questions')
                        .select()
                        .in('problem_id', problem_ids);
                    if(!res4.error){
                        questions = res4.data;
                    }

                    const res5 = await supabase
                        .from('questionReplies')
                        .select()
                        .in('problem_id', problem_ids);
                    if(!res5.error){
                        replies = res5.data;
                    }

                    //get and set submissions only if user is logged in
                    // And only get correct ones to show. Incorrect submissions will just reset.
                    if(!user.guest){
                        const res6 = await supabase
                            .from('submissions')
                            .select()
                            .match({user_id: user.id, verdict: 'correct'})
                            .in('problem_id', problem_ids);
                        if(!res6.error){
                            submissions.set(res6.data);
                        }
                    }

                    return {
                        props: {
                            user,
                            course,
                            problemSet,
                            questions,
                            replies
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

    import AddProblem from '$lib/components/AddProblem.svelte';
    import Problem from '$lib/components/Problem.svelte';

    export let user;
    export let course;
    export let problemSet = {};
    export let questions = [];
    export let replies = [];

    let isAdmin = course.admins.includes(user.id) ? true : false;


</script> 

<div class="mw7 center pa4">
    <div class="ml3 ml0-ns lh-title f3 fw4">{problemSet.name}</div>
</div>

<div class="mw7 center ph4 pb2">
    <div class="divider ml3 ml0-ns w-75-ns"></div>
    <ul class="list pl0 ma0"> 
        {#if $problems.length > 0}
            {#each $problems as problem, i (problem.id)}
                {#key problem}
                    <Problem
                        {problem} 
                        number={i+1} 
                        {isAdmin} 
                        questions={questions.filter(question => question.problem_id == problem.id)} 
                        replies={replies.filter(reply => reply.problem_id == problem.id)} />
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





