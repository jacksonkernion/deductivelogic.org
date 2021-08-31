<script context="module">

    import supabase from "$lib/db";
    import { courses, problemSets } from '$lib/stores.js';
    
    export async function load({ session }) {
        const { user } = session;
        if(user.guest){
            //redirect
        }
        else{
            const coursesQueryStr = user.courses.map(courseId => 'id.eq.' + courseId).join(',');
            const pSetsQueryStr = user.courses.map(courseId => 'course_id.eq.' + courseId).join(',');
            
            const req1 = await supabase
                .from('courses')
                .select()
                .or(coursesQueryStr);
            courses.set(req1.data);

            console.log(req1.data);
            
            const req2 = await supabase
                .from('problemSets')
                .select()
                .or(pSetsQueryStr);
            problemSets.set(req2.data);

            console.log(req2.data);

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
    import {session} from "$app/stores";

    import Auth from "$lib/components/Auth.svelte";
    import Course from "$lib/components/Course.svelte";
    import CreateCourse from "$lib/components/AddCourse.svelte";
//import { courses, problemSets } from "$lib/stores";

    // import {problemSets} from '$lib/problemSets.js';

    export let user;
    
    //let course = {name: null, slug: null};

</script>

<div class="bg-near-white bb b--black-10">

    <div class="cf mw7 center ph4">
        <div class="ttu lh-title f7 fw6 tracked mv3 pt1 tl black-80 dib v-mid">deductivelogic.org</div>
        <div class="fr tr dib v-mid">
            <Auth {user} />     
        </div>
    </div>

</div>

<div class="mw7 center pa4">

    {#each $courses as course}
        <Course {course} pSets={$problemSets.filter(pSet => pSet.course_id == course.id)}/>
    {/each}

    <CreateCourse />
    
</div>