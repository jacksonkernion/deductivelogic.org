<script context="module">

    let loading = false;

    import supabase from "$lib/db";
    import { courses, problemSets } from '$lib/stores.js';
    
    export async function load({ session }) {
        
        loading = true;
        const { user } = session;

        if(user.guest || !user.courses){
            return {};
        }
        else{

            if(user.courses.length > 0){
                const coursesQueryStr = user.courses.map(courseId => 'id.eq.' + courseId).join(',');
                const pSetsQueryStr = user.courses.map(courseId => 'course_id.eq.' + courseId).join(',');
                
                const res1 = await supabase
                    .from('courses')
                    .select()
                    .or(coursesQueryStr)
                    .order('name', {ascending: true});
                
                let coursesList = [];

                //If a course admin, populate userProfiles, for course management
                for(let course of res1.data){
                    if(course.admins.includes(user.id)){
                        const { data, error } = await supabase
                            .from('profiles')
                            .select()
                            .in('id', course.users)
                            .order('lastName');
                        if (data){
                            course.userProfiles = data;
                        } else {
                            //throw new Error(error);
                        }
                    }
                    coursesList.push(course);
                }

                courses.set(coursesList);

                const res2 = await supabase
                    .from('problemSets')
                    .select()
                    .or(pSetsQueryStr);
                
                let problem_ids = [];
                let pSets = [];
                for(const pSet of res2.data){
                    pSets = [...pSets, {...pSet, correctSubmissions: 0 }];
                    problem_ids = [...problem_ids, ...pSet.problemsOrder];
                }
                const res3 = await supabase
                    .from('submissions')
                    .select()
                    .match({user_id: user.id, verdict: 'correct'});
                if(res3.data){
                    let submissions = [...res3.data];
                    pSets = pSets.map(pSet => {
                        if(pSet.problemsOrder.length == 0){
                            return pSet;
                        }
                        let correctProblemIds = [];
                        for(const submission of submissions.filter(submission => pSet.problemsOrder.includes(submission.problem_id))){
                            if(submission.verdict == 'correct'){
                                if(!correctProblemIds.includes(submission.problem_id)){
                                    pSet.correctSubmissions++;
                                    correctProblemIds = [...correctProblemIds, submission.problem_id];
                                }
                            }
                        }
                        return pSet;
                    });
                    problemSets.set(pSets);
                }             
                else{
                    problemSets.set(pSets);
                }                       
            }
            loading = false;
            return {};
        }
    }
    

    /*
    export async function load({ fetch, session }) {
        // Approach #1 - Call the session getter API
		const res = await fetch('auth.json');
		if (res.ok) {
            const { user } = await res.json();
            if (user && !user.guest) {
                return {
                    props: {
                        user
                    }
                };
            }
            else{
                return {};
            }
        } else {
            return {
                status: res.status,
                error: new Error(`Could not load ${API_AUTH}`)
            };
        }
    }
    */

</script>

<script>

    import { session } from "$app/stores";

    import Welcome from "$lib/Welcome.svelte"
    import Course from "$lib/components/Course.svelte";
    import CourseModal from "$lib/components/modal-forms/CourseModal.svelte";

</script>

<!-- If not logged in, display 'welcome' page -->
{#if $session.user.guest}

    <Welcome />

{:else} <!-- If logged in, display 'home' page -->

<div class="mw7 center ph4 pb4">

    {#if loading}

        <p class="f3 tc black-50">Loading...</p>

    {:else if $courses.length > 0 }
        {#each $courses as course}
            <Course
                {course}
                pSets={$problemSets.filter(pSet => pSet.course_id == course.id).sort((a, b) => {return a.number - b.number})}
            />
        {/each}
    {:else}
        <div class="lh-copy mt4 pv6 ba br2 b--black-10 v-mid cf black-40 bg-near-white tc">
            <p class="dib f4 fw4 pv2 mh0 mt0 mb3">No Joined Courses</p><br/>
            <a class="f6" href="/browse">Browse Courses</a>
        </div>
    {/if}
    
    
</div>

<div class="footer bg-near-white">
    <div class="cf pv2 mw7 pa4 center f6 light-silver h2">
        <div class="fl pv2">
            <a class="light-silver" href="/browse"> Browse Courses</a>
        </div>
        <div class="fr pv2">
            Course Instructor? <CourseModal />
        </div>
    </div>
</div>

{/if}