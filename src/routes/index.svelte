<script context="module">

    import supabase from "$lib/db";
    import { courses, problemSets } from '$lib/stores.js';
    
    export async function load({ session }) {
        const { user } = session;
        if(user.guest){
            return {
                props: {
                    user
                }
            };
        }
        else{

            if(user.courses.length > 0){
                const coursesQueryStr = user.courses.map(courseId => 'id.eq.' + courseId).join(',');
                const pSetsQueryStr = user.courses.map(courseId => 'course_id.eq.' + courseId).join(',');
                
                const res1 = await supabase
                    .from('courses')
                    .select()
                    .or(coursesQueryStr);
                courses.set(res1.data);

                const res2 = await supabase
                    .from('problemSets')
                    .select()
                    .or(pSetsQueryStr);
                problemSets.set(res2.data);
            }

            return {
                props: {
                    user
                }
            };
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

    import Welcome from "$lib/Welcome.svelte"
    import AuthModal from "$lib/components/modal-forms/AuthModal.svelte";
    import Course from "$lib/components/Course.svelte";
    import CourseModal from "$lib/components/modal-forms/CourseModal.svelte";

    export let user;
    
    //let course = {name: null, slug: null};

/* Script used for importing json problemSet data to supabase DB


    import {pSets} from '$lib/problemSets.js';

    pSets = pSets.map((problemSet) => {
        problemSet.problems = problemSet.problems.map((problem) => {
            if(typeof problem.logStrSet == 'string')
                problem.logStrSet = problem.logStrSet.split(',');
            if(typeof problem.sentSet == 'string')
                problem.sentSet = problem.sentSet.split('/');
            if(problem.question)
                problem.sent = problem.question;
            
            delete problem.id;
            delete problem.answer;
            delete problem.question;
            delete problem.assignment_id;
              
            return problem;
        });

        problemSet.course_id = 31;
        problemSet.name = "Problem Set " + problemSet.number;
        problemSet.published = true;

        return problemSet;
 
    });

    async function populateDB (pSets){
        for (pSet of pSets) {
            try {
                let pSetId;

                const res1 = await supabase
                    .from('problemSets')
                    .upsert([
                        {
                            number: pSet.number,
                            name: pSet.name,
                            published: pSet.published,
                            course_id: pSet.course_id
                        }
                    ]);
                if (res1.error) throw res1.error;
                if (res1.data){
                    pSetId = res1.data[0].id;
                }

                pSet.problems = pSet.problems.map((problem) => {
                    problem.problemSet_id = pSetId;
                    return problem;
                });

                const res2 = await supabase
                    .from('problems')
                    .upsert(pSet.problems);
                if (res2.error) throw res2.error;

            } catch (error) {
                console.log(error.error_description || error.message);
            }
        }
        console.log('success?');
    };

    populateDB(pSets);

*/

</script>

<!-- If not logged in, display 'welcome' page -->
{#if user.guest}

    <Welcome {user} />

{:else} <!-- If logged in, display 'home' page -->

<div class="bg-near-white bb b--black-10">

    <div class="cf mw7 center ph4">
        <div class="ttu lh-title f7 fw6 tracked mv3 pt1 tl black-80 dib v-mid">deductivelogic.org</div>
        <div class="fr dib v-mid">
            <AuthModal {user} />     
        </div>
    </div>

</div>

<div class="mw7 center pa4">

    {#if $courses.length > 0 }
        {#each $courses as course}
            <Course {course} pSets={$problemSets.filter(pSet => pSet.course_id == course.id)}/>
        {/each}
    {:else}
        <div class="lh-copy pv6 ba br2 b--black-10 v-mid cf black-40 bg-near-white tc"><p class="dib f4 fw4 pv2 ma0">No Enrolled Courses</p></div>
    {/if}
    
    
</div>

<div class="footer bg-near-white">
    <div class="cf pv2 mw7 pa4 center f6 light-silver h2">
        <div class="fl">
            <p></p>
        </div>
        <div class="fr pv2">
            Course Instructor? <CourseModal />
        </div>
    </div>
</div>

{/if}