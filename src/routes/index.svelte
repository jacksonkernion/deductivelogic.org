<script context="module">

    let loading = false;

    import supabase from "$lib/db";
    
    export async function load({ session }) {
        
        loading = true;
        const { user } = session;

        if(user.guest || !user.courses){
            return {};
        }
        else{

            let courses = [];

            if(user.courses.length > 0){
                const coursesQueryStr = user.courses.map(courseId => 'id.eq.' + courseId).join(',');
                
                const res1 = await supabase
                    .from('courses')
                    .select('*, problemSets(*)')
                    .or(coursesQueryStr)
                    .order('name', {ascending: true});
                
                courses = res1.data;
                
                let submissions = [];

                const res2 = await supabase
                    .from('submissions')
                    .select()
                    .match({user_id: user.id, verdict: 'correct'});
                if(res2.data)
                    submissions = [...res2.data];
                
                for(let i in courses){
                    courses[i].problemSets = courses[i].problemSets.sort((a, b) => {return a.number - b.number});

                    //If a course admin, populate userProfiles, for course management
                    if(courses[i].admins.includes(user.id)){
                        const { data, error } = await supabase
                            .from('profiles')
                            .select()
                            .in('id', courses[i].users)
                            .order('lastName');
                        if (data){
                            courses[i].userProfiles = data;
                        } else {
                            //throw new Error(error);
                        }
                    }
                    //add a correctSubmission property to every pSet
                    for(let j in courses[i].problemSets){
                        courses[i].problemSets[j].correctSubmissions = 0;
                        if(courses[i].problemSets[j].problemsOrder.length !== 0){
                            let correctProblemIds = [];
                            for(const submission of submissions.filter(submission => courses[i].problemSets[j].problemsOrder.includes(submission.problem_id))){
                                if(submission.verdict == 'correct'){
                                    if(!correctProblemIds.includes(submission.problem_id)){
                                        courses[i].problemSets[j].correctSubmissions++;
                                        correctProblemIds = [...correctProblemIds, submission.problem_id];
                                    }
                                }
                            }
                        }
                    }

                }
                                  
            }
            loading = false;
            return {
                props: { coursesList: courses }
            };
        }
    }
    

</script>

<script>

    import { session } from "$app/stores";

    import Welcome from "$lib/Welcome.svelte"
    import Course from "$lib/components/Course.svelte";
    import CourseModal from "$lib/components/modal-forms/CourseModal.svelte";
    import { courses } from "$lib/stores";

    export let coursesList = [];

    $courses = coursesList;

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
            <Course {course} />
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