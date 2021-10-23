<script>
    import {shuffle} from '$lib/utils';

    export let problem, submission;
    let question = problem.sent;
    let sentSet = problem.sentSet;
    let answer = problem.logStr;

    let studentAnswer = '';

    let options = shuffle([...sentSet, answer]);

    submission.check = function() {
        if(studentAnswer == answer){
            submission.log('correct');
        }
        else{
            submission.log('incorrect', 'Incorrect');
        }
    }
</script>

<div class="lh-copy">
    <p>{question}</p>
</div>
	
<div class="submission-input">
        
    <select bind:value={studentAnswer}>
        <option value="none"></option>
        {#each options as option}
            <option value="{option}">{option}</option>
        {/each}
    </select>
    
</div>