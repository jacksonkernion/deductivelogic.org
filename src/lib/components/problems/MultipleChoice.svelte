<script>
    import ProblemWrapper from '$lib/components/problems/sub-components/ProblemWrapper.svelte';
    import {shuffle} from '$lib/utils';

    export let problem, number, isAdmin;
    let question = problem.question;
    let sentSet = problem.sentSet;
    let answer = problem.answer;

    let studentAnswer = '';

    let options = shuffle([...sentSet, answer]);

    let submission;

    function checkSubmission() {
        if(studentAnswer == answer){
            submission.log('correct', 'Correct');
        }
        else{
            submission.log('incorrect', 'Incorrect');
        }
    }
</script>


<ProblemWrapper bind:submission on:click={checkSubmission} {problem} {number} {isAdmin}>
    <div slot="description">
        <p>{question}</p>
    </div>
	
    <div slot="submission-input">
        
        <select bind:value={studentAnswer}>
            <option value="none"></option>
            {#each options as option}
                <option value="{option}">{option}</option>
            {/each}
        </select>
    
    </div>

</ProblemWrapper>