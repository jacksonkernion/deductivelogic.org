<script>

    import LogStrInput from '$lib/components/problems/sub-components/LogStrInput.svelte';
    import ProblemWrapper from '$lib/components/problems/sub-components/ProblemWrapper.svelte';
    
    import {parseLogStr, quantParaphrase} from '$lib/logic.js';
    import {dispLogStr} from '$lib/utils';
    import {connectives} from '$lib/stores';
    
    export let problem, number, isAdmin;
    let sent = problem.sent;
    let logStr = problem.logStr;
    let sentSet = problem.sentSet;

    let studentLogStr = '';
    let submission;

    function checkSubmission(){

        if(!parseLogStr(studentLogStr))
            submission.log('warn', "Could not parse schema: "+dispLogStr(studentLogStr, $connectives));
		
		if(quantParaphrase(logStr, studentLogStr))
            submission.log('correct', 'Correct');
		else
            submission.log('incorrect', 'Incorrect');
    }
</script>

<ProblemWrapper bind:submission on:click={checkSubmission} {problem} {number} {isAdmin}>
    <div slot="description">
        <p>Paraphrase the following sentence in logical notation:</p>
        <div class="description-line">{sent}</div>
        <p>Use the following predicates:</p>
        {#each sentSet as sentence, i}
            <div class="description-line logStr">
                {sentence}
            </div>
        {/each}
    </div>
	<div slot="submission-input" class="submission-input-line">
        <LogStrInput bind:logStr={studentLogStr} />
    </div>
</ProblemWrapper>