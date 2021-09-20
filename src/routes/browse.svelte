<script context="module">

    import supabase from "$lib/db";
    
    export async function load({ session }) {
        const { user } = session;

        const res1 = await supabase
                .from('courses')
                .select()
                .order('name', {ascending: true});
        const res2 = await supabase
                .from('problemSets')
                .select()
                .eq('published', true);

        return {
            props: {
                user: user,
                courses: res1.data,
                problemSets: res2.data,
            }
        };

    }

</script>

<script>

    import AuthModal from "$lib/components/modal-forms/AuthModal.svelte";
    import Course from "$lib/components/Course.svelte";
    import CourseModal from "$lib/components/modal-forms/CourseModal.svelte";

    export let user, courses, problemSets;

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

    <div class="lh-title f3 fw4">Browse Courses</div>

    {#each courses as course}
        <div class="mv4"></div>
        <Course mode="browse" {user} {course} pSets={problemSets.filter(pSet => pSet.course_id == course.id).sort((a, b) => {return a.number - b.number})}/>
    {/each}
    
    
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