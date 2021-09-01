<script context='module'>
    export async function load({ page, fetch, session, context }) {
		let courseSlug = page.params.courseSlug;
		return { props: { courseSlug }};
	}
</script>
<script>
    //import {user} from "$lib/sessionStore"
    import supabase from "$lib/db"
    import Auth from "$lib/components/Auth.svelte"

    export let courseSlug = '';

    import Modal from '$lib/jui-components/Modal.svelte';
</script>

<div class="bg-washed-green bb b--green bw1">

    <div class="mw7 pa4 center pb4 dark-green">
        <div class="ttu lh-title f3 fw6 tracked pt6 pb2">{courseSlug}</div>
    </div>

</div>

<div class="mw7 center pa4">
    <ul class="list pl0">
        <!--
        {#each problemSets as problemSet}
            <li class="lh-copy pv3 ba bl-0 bt-0 br-0 b--black-10">
                <a href="{courseSlug}/pset{problemSet.number}">Problem Set {problemSet.number}</a>
            </li>
        {/each}
        -->
    </ul>
</div>