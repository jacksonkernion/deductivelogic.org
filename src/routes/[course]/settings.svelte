<script context="module">
    import supabase from "$lib/db";

    export async function load({ page, fetch, session, context }) {
		let courseSlug = page.params.course;
        let { data, error, status } = await supabase
            .from('courses')
            .select()
            .eq('slug', courseSlug)
            .single()

      if (error && status !== 406) throw error

      if (data) {
        course = data;
        return { props: { course }};
      }
	}
</script>
<script>
    import Course from "$lib/components/Course.svelte"
    export let course;

    async function updateCourse() {
    try {
      loading = true
      //const user = supabase.auth.user()

      let { error } = await supabase.from('courses').upsert(course, {
        returning: 'minimal', // Don't return the value after inserting
      })

      if (error) throw error
    } catch (error) {
      alert(error.message)
    } finally {
      loading = false
    }
  }

</script>

<Course bind:course />