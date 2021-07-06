<script>
    import {problemSets} from '$lib/problemSets.js';
</script>

<h1>deductivelogic.org 2.0</h1>

<ul class="list pl0 measure center">
    {#each problemSets as problemSet}
        <li class="lh-copy pv3 ba bl-0 bt-0 br-0 b--black-10">
            <a href="/pset{problemSet.number}">Problem Set {problemSet.number}</a>
        </li>
    {/each}
</ul>


