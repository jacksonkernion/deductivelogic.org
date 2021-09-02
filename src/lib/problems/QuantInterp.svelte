<script>
    import QuantInterpInput from '$lib/components/QuantInterpInput.svelte';
    import ProblemWrapper from '$lib/components/ProblemWrapper.svelte';
    
    import {tVal, parseLogStr, getQuantPreds} from '$lib/logic.js';
    import {dispLogStr} from '$lib/helpers.js';
    
    export let logStr = '';
    export let number = '';
    export let sentSet = [];

    let interpretations = {true: {domainSize:1}, false: {domainSize:1}};
    let quantPreds = getQuantPreds(logStr);

    let submission;

    function checkSubmission(){
        if(sentSet.includes('true')){
			//Evaluate if true on provided assignments
			if(!tVal(parseLogStr(logStr), interpretations.true)){
				submission.log('incorrect', 'True interpretation is incorrect');
                return;
			}
		}
		if(sentSet.includes('false')){
			//Evaluate if true on provided assignments
			if(tVal(parseLogStr(logStr), interpretations.false)){
				submission.log('incorrect', 'False interpretation is incorrect');
                return;
			}
		}
		submission.log('correct', 'Correct');
    }

</script>


<ProblemWrapper bind:submission on:click={checkSubmission} {number}>
    <div slot="description">
        <p>Specify an interpretation that makes the following schema {#if sentSet.includes('true')}true{/if}{#if sentSet.includes('true') && sentSet.includes('false')}, and an intrepretation that makes it {/if}{#if sentSet.includes('false')}false{/if}:</p>
        <div class="description-line logStr">{dispLogStr(logStr)}</div>
    </div>
	
    <div slot="submission-input" >
        
        {#if sentSet.includes('true')}
            <div class="mv3">
                {#if sentSet.includes('true') && sentSet.includes('false')}
                    <div class="f6 black-50 pb2 ml4">True interpretation:</div>
                {/if}
                <QuantInterpInput bind:interpretation={interpretations.true} {quantPreds}></QuantInterpInput>
            </div>
        {/if}
        {#if sentSet.includes('false')}
            <div class="mv3">
                {#if sentSet.includes('true') && sentSet.includes('false')}
                    <div class="f6 black-50 pv2 ml4">False interpretation:</div>
                {/if}
                <QuantInterpInput bind:interpretation={interpretations.false} {quantPreds}></QuantInterpInput>
            </div>
        {/if}
    </div>

</ProblemWrapper>
