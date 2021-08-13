<script>

    import LogStrInput from '$lib/components/LogStrInput.svelte';
    import ProblemWrapper from '$lib/components/ProblemWrapper.svelte';
    
    import {parseLogStr, quantParaphrase} from '$lib/logic.js';
    import {dispLogStr} from '$lib/helpers.js';
    
    export let sent = '';
    export let logStr = '';
    export let number = '';
    export let sentSet = [];

    let studentLogStr = '';
    let submission;

    function checkSubmission(){

        if(!parseLogStr(studentLogStr))
            submission.log('warn', "Could not parse schema: "+dispLogStr(studentLogStr));
		
		if(quantParaphrase(logStr, studentLogStr))
            submission.log('correct', 'Correct');
		else
            submission.log('incorrect', 'Incorrect');
    }
</script>

<ProblemWrapper bind:submission on:click={checkSubmission} {number}>
    <div slot="description">
        <p>Paraphrase the following sentence in logical notation:</p>
        <div class="description-line">{sent}</div>
        <p>Use the following predicates:</p>
        {#each sentSet as sentence, i}
            <div class="description-line">
                {sentence}
            </div>
        {/each}
    </div>
	<div slot="submission-input">
        <LogStrInput bind:logStr={studentLogStr} />
    </div>
</ProblemWrapper>