<script>

    import TruthAssignmentInput from '$lib/components/TruthAssignmentInput.svelte';
    import HiddenTruthTable from '$lib/components/HiddenTruthTable.svelte';
    import ProblemWrapper from '$lib/components/ProblemWrapper.svelte';

    import {tVal, validity, parseLogStr, getLetterVars, dispLogStr} from '$lib/logic.js';

    export let logStr1 = '';
    export let logStr2 = '';
    export let number = '';

    // let isQ = false;
    let letterVars = getLetterVars(logStr1+' > '+logStr2);
    let submission;
	let answer;
	let interpretation = {};

    function checkSubmission() {

		if(!answer){
			
			//Evaluates if false on provided assignments
			if(!tVal(parseLogStr('('+logStr1+') > ('+logStr2+')'), interpretation)){
				submission.log('correct', "Correct");
                return;
			}
            else{
                submission.log('incorrect', "Incorrect");
                return;
            }
		}
		else if(answer){
			//Evaluate validity of conditional
			if(validity('('+logStr1+') > ('+logStr2+')')){
				submission.log('correct', "Correct");
                return;
			}
			else{
				submission.log('incorrect', "Incorrect");
                return
			}
		}
	}
	
</script>

<style>

</style>

<ProblemWrapper bind:submission on:click={checkSubmission} {number}>
    <div slot="description">
        <p>Does schema (1) imply schema (2)?</p>
        <div class="description-line"><span class="description-line-marker">1.</span> {dispLogStr(logStr1)}</div>
        <div class="description-line"><span class="description-line-marker">2.</span> {dispLogStr(logStr2)}</div>
        <p>If implication fails to hold, provide an interpretation that witnesses this fact.</p>
    </div>
	
    <div slot="submission-input" class="tc">
        <!-- {#if !isQ} 
            <HiddenTruthTable logStr={'[' + logStr1 + '] > [' + logStr2 + ']'} />   
        {/if}
        -->
            
        <HiddenTruthTable logStr={'[' + logStr1 + '] > [' + logStr2 + ']'} />

        <div class="flex w5 center items-center mb2">
            <input class="mr2" type=radio bind:group={answer} name="implies" value={true} />
            <label for={true} class="lh-copy">Implies</label>
        </div>
        <div class="flex w5 center items-center mb2">
            <input class="mr2" type=radio bind:group={answer} name="implies" value={false} />
            <label for={false} class="lh-copy">Does not imply...</label>
        </div>

        <div class="extra-question-wrapper pb2" hidden={answer!=false}>
            <div class="extra-question-message f6 black-50 pb2">...as shown with interpretation:</div>
            <TruthAssignmentInput {letterVars} bind:interpretation />
        </div>
    </div>

</ProblemWrapper>