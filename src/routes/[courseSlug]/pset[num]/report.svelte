<script context="module">
    import supabase from "$lib/db";

    export async function load({page, session }) {

        const { user } = session;
            
        const res1 = await supabase
            .from('courses')
            .select('*, problemSets(name, problemsOrder, problems(id, submissions(*)))')
            .eq('slug', page.params.courseSlug)
            .eq("problemSets.number", page.params.num)
            .single();

        if(!res1.error){

            const course = res1.data;
            const problemSet = course.problemSets[0];
            problemSet.problems = problemSet.problems.sort((a, b) => {return problemSet.problemsOrder.indexOf(a.id) - problemSet.problemsOrder.indexOf(b.id)});
            let isAdmin = course.admins.includes(user.id) ? true : false;

            if(!isAdmin){
                return {
                    status: 403,
                    error: new Error('To access this page, you must sign in to an admin account for '+course.name+'.')
                };
            }

            

            const res2 = await supabase
                .from('profiles')
                .select()
                .in('id', course.users)
                .order('lastName', { ascending: true });
            
            if(!res2.error){
                const students = res2.data;
                return {
                    props: {
                        problemSet,
                        students
                    }
                };
            }

        }
        
        return {
            status: 404,
            error: new Error('No problem sets match this URL.')
        };
         
    }
</script>
<script>

    export let problemSet = {problems:[]};
    export let students = [];

    let problemSetSize = problemSet.problems.length;
    let problemRecords = {};

    for(let i=0; i < problemSet.problems.length; i++){
        problemRecords[problemSet.problems[i].id] = {number: (i+1), correct: 0, incorrect: 0};
    }

    for(let i=0; i < students.length; i++){
        students[i].incorrect = 0;
        students[i].correct = 0;
    }
    
    for(const problem of problemSet.problems){

        for(let i in students){

            let submissions = problem.submissions.filter(sub => sub.user_id === students[i].id);

            if(submissions.some(s => s.verdict === 'correct')){
                students[i].correct++;
                problemRecords[problem.id].correct++;
            }
            else{
                problemRecords[problem.id].incorrect += submissions.reduce((count, sub) => sub.verdict !== 'correct' ? count++ : count, 0);
                // students[i].incorrect += submissions.reduce((count, sub) => sub.verdict !== 'correct' ? count++ : count, 0);
            }
        }

    }
	
</script> 

<style>
    .icon{
        height: 16px;
    }

</style>

<div class="mw7 center pa4">
    <div class="lh-title f3 fw4">{problemSet.name} ・ Submissions Report</div>
</div>

<div class="mw7 center ph4 pb2">
    
    <div class="mt3 cf bb b--black-40">
        <p class="fl fw5 f5 lh-title mb2 mt3">Individual Progress</p>
    </div>
    <ul class="list pl0 mh0 mt0">
        {#each students as student}
            <li class="lh-copy pv2 bb b--black-10 v-mid cf">
                <div class="fl">
                  <p class="dib f6 pv2 ma0">{student.lastName}, {student.firstName}</p>
                </div>
                <div class="fr black-50">
                    <p class="dib f6 pv2 ma0">Completed: {student.correct}/{problemSetSize}</p>
                  
                    {#if student.correct === problemSetSize}
                        <div class="icon dib v-mid ph2 green">
                            <ion-icon name="checkmark-outline"></ion-icon>   
                        </div>   
                    {:else}
                        <div class="icon dib v-mid ph2">
                            <ion-icon name="remove-outline"></ion-icon>
                        </div>
                    {/if}
                </div>
            </li>
        {/each}
    </ul>


    <div class="mt3 cf bb b--black-40">
        <p class="fl fw5 f5 lh-title mb2 mt3">Per Problem Stats</p>
    </div>
    <ul class="list pl0 mh0 mt0">
        {#each problemSet.problems as problem}
            <li class="lh-copy pv2 bb b--black-10 v-mid cf">
                <div class="fl">
                  <p class="dib f6 pv2 ma0">Problem {problemRecords[problem.id].number}</p>
                </div>
                <div class="fr black-50">
                    <p class="dib f6 pv2 ma0">Correct/Incorrect submissions: {problemRecords[problem.id].correct}/{problemRecords[problem.id].incorrect}</p>
                </div>
            </li>
        {/each}
    </ul>

</div>





