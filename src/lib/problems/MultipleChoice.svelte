<script>

export let id = '';
export let question = '';
export let sentenceSet = [];
export let answer = '';

let submission = '';
let submissionStatus = '';
let submissionMessage = '';

function checkSubmission() {
    if(answer == submission){
        submissionStatus = 'success';
        submissionMessage = "Success message";
    }
    else{
        submissionStatus = 'error';
        submissionMessage = "Error message";
    }
}
</script>

<li class="lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30">
    
    <p>{id}. {question}</p>
    <select bind:value={submission}>
        <option value="none"></option>
        {#each sentenceSet as option}
            <option value="{option}">{option}</option>
        {/each}
    </select>
    <div class="cf">
        <div class="fl">{submissionMessage}</div>
        <button class="fr f6 link dim br2 ph3 pv2 mb2 dib white bg-black" on:click={checkSubmission}>Check</button>
    </div>
    
</li>