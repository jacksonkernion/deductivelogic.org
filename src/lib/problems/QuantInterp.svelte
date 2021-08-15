<script>
    import QuantInterpInput from '$lib/components/QuantInterpInput.svelte';
    import ProblemWrapper from '$lib/components/ProblemWrapper.svelte';
    
    import {tVal, parseLogStr, getQuantPreds} from '$lib/logic.js';
    import {dispLogStr} from '$lib/helpers.js';
    
    export let logStr = '';
    export let number = '';
    export let interpsRequested = [];

    let interpretations = {true: {domainSize:1}, false: {domainSize:1}};
    let quantPreds = getQuantPreds(logStr);

    let submission;

    function checkSubmission(){
        if(interpsRequested.includes('true')){
			//Evaluate if true on provided assignments
			if(!tVal(parseLogStr(logStr), interpretations.true)){
				submission.log('incorrect', 'True interpretation is incorrect');
                return;
			}
		}
		if(interpsRequested.includes('false')){
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
        <p>Specify an interpretation that makes the following schema {#if interpsRequested.includes('true')}true{/if}{#if interpsRequested.includes('true') && interpsRequested.includes('false')}, and such an intrepretation that makes it {/if}{#if interpsRequested.includes('false')}false{/if}:</p>
        <div class="description-line logStr">{dispLogStr(logStr)}</div>
    </div>
	
    <div slot="submission-input" >
        
        {#if interpsRequested.includes('true')}
            <div class="mv3">
                {#if interpsRequested.includes('true') && interpsRequested.includes('false')}
                    <div class="f6 black-50 pb2 ml4">True interpretation:</div>
                {/if}
                <QuantInterpInput bind:interpretation={interpretations.true} {quantPreds}></QuantInterpInput>
            </div>
        {/if}
        {#if interpsRequested.includes('false')}
            <div class="mv3">
                {#if interpsRequested.includes('true') && interpsRequested.includes('false')}
                    <div class="f6 black-50 pv2 ml4">False interpretation:</div>
                {/if}
                <QuantInterpInput bind:interpretation={interpretations.false} {quantPreds}></QuantInterpInput>
            </div>
        {/if}
    </div>

</ProblemWrapper>
