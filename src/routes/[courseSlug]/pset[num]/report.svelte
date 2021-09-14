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
            let isAdmin = course.admins.includes(user.id) ? true : false;

            if(!isAdmin){
                return {
                    status: 403,
                    error: new Error('To access this page, you must sign in to an admin account for '+course.name+'.')
                };
            }

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

                    const problems = res3.data.sort((a, b) => {return problemSet.problemsOrder.indexOf(a.id) - problemSet.problemsOrder.indexOf(b.id)});
                    let problem_ids = problemSet.problemsOrder;
                    const res4 = await supabase
                        .from('submissions')
                        .select()
                        .in('problem_id', problem_ids);
                    
                    if(!res4.error){
                        const submissions = res4.data;
                        const res5 = await supabase
                            .from('profiles')
                            .select()
                            .in('id', course.users)
                            .order('lastName', { ascending: true });
                        
                        if(!res5.error){
                            const students = res5.data;
                            return {
                                props: {
                                    user,
                                    course,
                                    problemSet,
                                    problems,
                                    submissions,
                                    students
                                }
                            };
                        }
                    }
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

    export let user;
    export let course;
    export let problemSet = {};
    export let problems = [];
    export let submissions = [];
    export let students = [];

    let problemSetSize = problems.length;
    let submissionRecords = [];
    let problemRecords = {};
    
    for(let i=0; i < problems.length; i++){
        problemRecords[problems[i].id] = {number: (i+1), correct: 0, incorrect: 0};
    }

    for(const student of students){
        let incorrect = 0;
        let correct = 0;
        let completed = false;
        let correctProblemIds = [];

        let studentSubmissions = submissions.filter(sub => sub.user_id == student.id);

        for(const submission of studentSubmissions){
            if(submission.verdict == 'correct'){
                if(!correctProblemIds.includes(submission.problem_id)){
                    correct++;
                    correctProblemIds = [...correctProblemIds, submission.problem_id];
                    problemRecords[submission.problem_id].correct++;
                }
            }
            else{
                incorrect++;
                problemRecords[submission.problem_id].incorrect++;
            }
        }

        // Make sure the answered correctly every currently-listed problem
        let result = false;
        for(const problem of problems){
            if(!correctProblemIds.includes(problem.id))
                result = true;
        }
        if(!result){
            completed = true;
        }

        submissionRecords.push({
            displayName: student.lastName + ', ' + student.firstName,
            correct: correct,
            incorrect: incorrect,
            completed: completed
        });
    }
	
</script> 

<style>
    .icon{
        height: 16px;
    }

</style>

<div class="bg-near-white bb b--black-10">

    <div class="cf mw7 center ph4">
        <a class="logo ttu lh-title f7 fw6 tracked mv3 pt1 tl black-80 dib v-mid" href="/">deductivelogic.org</a>
        <div class="fr dib v-mid">
            <AuthModal {user} />     
        </div>
    </div>

</div>

<div class="mw7 center pa4">
    <div class="lh-title f3 fw4">{problemSet.name} ・ Submissions Report</div>
</div>

<div class="mw7 center ph4 pb2">
    
    <div class="mt3 cf bb b--black-40">
        <p class="fl fw5 f5 lh-title mb2 mt3">Individual Progress</p>
    </div>
    <ul class="list pl0 mh0 mt0">
        {#each submissionRecords as submissionRecord}
            <li class="lh-copy pv2 bb b--black-10 v-mid cf">
                <div class="fl">
                  <p class="dib f6 pv2 ma0">{submissionRecord.displayName}</p>
                </div>
                <div class="fr black-50">
                    <p class="dib f6 pv2 ma0">Completed: {submissionRecord.correct}/{problemSetSize}</p>
                  
                    {#if submissionRecord.completed}
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
        {#each problems as problem}
            <li class="lh-copy pv2 bb b--black-10 v-mid cf">
                <div class="fl">
                  <p class="dib f6 pv2 ma0">Problem {problemRecords[problem.id].number}</p>
                </div>
                <div class="fr black-50">
                    <p class="dib f6 pv2 ma0">Correct/Incorrect submissions: {problemRecords[problem.id].correct}/{problemRecords[problem.id].incorrect}</p>
                    
                    <!--
                    <div class="icon dib v-mid ph2">
                        {#if problemRecords[problem.id].completed}
                            <ion-icon name="checkmark-outline"></ion-icon>      
                        {:else}
                            <ion-icon name="remove-outline"></ion-icon>  
                        {/if}
                    </div>
                    -->
                </div>
            </li>
        {/each}
    </ul>

</div>





