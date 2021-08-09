<script context='module'>
    export async function load({ page, fetch, session, context }) {
		let courseSlug = page.params.course;
		return { props: { courseSlug }};
	}
</script>
<script>
    import {problemSets} from '$lib/problemSets.js';
    export let courseSlug = '';

</script>

<h1 class='ttu w-100'>{courseSlug}</h1>

<ul class="list pl0">
    {#each problemSets as problemSet}
        <li class="lh-copy pv3 ba bl-0 bt-0 br-0 b--black-10">
            <a href="{courseSlug}/pset{problemSet.number}">Problem Set {problemSet.number}</a>
        </li>
    {/each}
</ul>