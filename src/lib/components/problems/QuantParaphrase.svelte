<script>

    import LogStrInput from '$lib/components/problems/sub-components/LogStrInput.svelte';
    
    import {parseLogStr, quantParaphrase} from '$lib/logic.js';
    import {dispLogStr} from '$lib/utils';
    import {connectives} from '$lib/stores';
    
    export let problem;
    export let submission;
    let sent = problem.sent;
    let logStr = problem.logStr;
    let sentSet = problem.sentSet;
    let studentLogStr = '';

    submission.check = function(){

        if(!parseLogStr(studentLogStr))
            this.log('warn', "Could not parse schema: "+dispLogStr(studentLogStr, $connectives));
		
		if(quantParaphrase(logStr, studentLogStr))
            this.log('correct');
		else
            this.log('incorrect', 'Incorrect');
    }
</script>


<div>
    <p>Paraphrase the following sentence in logical notation:</p>
    <div class="description-line">{sent}</div>
    <p>Use the following predicates:</p>
    {#each sentSet as sentence, i}
        <div class="description-line logStr">
            {sentence}
        </div>
    {/each}
</div>
<div class="submission-input">
    <div class="submission-input-line">
        <LogStrInput bind:logStr={studentLogStr} />
    </div>
</div>