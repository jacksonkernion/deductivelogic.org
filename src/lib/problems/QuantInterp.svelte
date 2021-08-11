<script>
    import QuantInterpInput from '$lib/components/QuantInterpInput.svelte';
    import ProblemWrapper from '$lib/components/ProblemWrapper.svelte';
    
    import {tVal, parseLogStr, dispLogStr, getQuantPreds} from '$lib/logic.js';
    
    export let logStr = '';
    export let number = '';
    export let sentSet = '';

    let interpretations = {true: {domainSize:1}, false: {domainSize:1}};
    let quantPreds = getQuantPreds(logStr);

    let sentSetArr = sentSet.split('/');
    let submission;

    function checkSubmission(){
        if(sentSetArr.includes('true')){
			//Evaluate if true on provided assignments
			if(!tVal(parseLogStr(logStr), interpretations.true)){
				submission.log('incorrect', 'The provided <i>true interpretation</i> is incorrect');
                return;
			}
		}
		if(sentSetArr.includes('false')){
			//Evaluate if true on provided assignments
			if(tVal(parseLogStr(logStr), interpretations.false)){
				submission.log('incorrect', 'The provided <i>false interpretation</i> is incorrect');
                return;
			}
		}
		submission.log('correct', 'Correct');
    }

</script>


<ProblemWrapper bind:submission on:click={checkSubmission} {number}>
    <div slot="description">
        <p>Specify an interpretation that makes the following schema {#if sentSetArr.includes('true')}true{/if}{#if sentSetArr.includes('true') && sentSetArr.includes('false')}, and such an intrepretation that makes it {/if}{#if sentSetArr.includes('false')}false{/if}:</p>
        <div class="description-line">{dispLogStr(logStr)}</div>
    </div>
	
    <div slot="submission-input" class="tc">
        
        {#if sentSetArr.includes('true')}
            <div>
                {#if sentSetArr.includes('true') && sentSetArr.includes('false')}
                    <div class="f6 black-50 pb2">True interpretation:</div>
                {/if}
                <QuantInterpInput bind:interpretation={interpretations.true} {quantPreds}></QuantInterpInput>
            </div>
        {/if}
        {#if sentSetArr.includes('false')}
            <div>
                {#if sentSetArr.includes('true') && sentSetArr.includes('false')}
                    <div class="f6 black-50 pv2">False interpretation:</div>
                {/if}
                <QuantInterpInput bind:interpretation={interpretations.false} {quantPreds}></QuantInterpInput>
            </div>
        {/if}
    </div>

</ProblemWrapper>
