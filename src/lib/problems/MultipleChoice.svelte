<script>
    import ProblemWrapper from '$lib/components/ProblemWrapper.svelte';

    export let number = '';
    export let question = '';
    export let sentenceSet = [];
    export let answer = '';

    let studentAnswer = '';

    let submission;

    function checkSubmission() {
        if(answer == submission){
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
	
    <div slot="submission-input" class="tc">
        
        <select bind:value={studentAnswer}>
            <option value="none"></option>
            {#each sentenceSet as option}
                <option value="{option}">{option}</option>
            {/each}
        </select>
    
    </div>

</ProblemWrapper>