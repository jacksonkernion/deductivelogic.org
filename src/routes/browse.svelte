<script context="module">

    import supabase from "$lib/db";
    
    export async function load( ) {

        const res = await supabase
                .from('courses')
                .select('*, problemSets(*)')
                .eq('problemSets.published', true)
                .order('name', {ascending: true});

        const courses = res.data

        for(let i in courses){
            courses[i].problemSets = courses[i].problemSets.sort((a, b) => {return a.number - b.number});
        }

        return {
            props: {
                courses
            }
        };

    }

</script>

<script>

    import Course from "$lib/components/Course.svelte";
    import CourseModal from "$lib/components/modal-forms/CourseModal.svelte";

    export let courses = [];

</script>

<div class="mw7 center pa4">

    <div class="lh-title f3 fw4">Browse Courses</div>

    {#each courses as course}
        <div class="mv4"></div>
        <Course mode="browse" {course} />
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