<script>
    import ProblemWrapper from '$lib/components/ProblemWrapper.svelte';
    import {shuffle} from '$lib/helpers.js';

    export let number = '';
    export let question = '';
    export let sentSet = [];
    export let answer = '';

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


<ProblemWrapper bind:submission on:click={checkSubmission} {number}>
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