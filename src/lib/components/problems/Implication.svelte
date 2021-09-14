<script>

    import TruthAssignmentInput from '$lib/components/problems/sub-components/TruthAssignmentInput.svelte';
    import HiddenTruthTable from '$lib/components/problems/sub-components/HiddenTruthTable.svelte';
    import ProblemWrapper from '$lib/components/problems/sub-components/ProblemWrapper.svelte';

    import {tVal, validity, parseLogStr, getLetterVars} from '$lib/logic.js';
    import {dispLogStr} from '$lib/utils';
    import {connectives} from '$lib/stores';

    export let problem, number,isAdmin;
    let logStr1 = problem.logStr1;
    let logStr2 = problem.logStr2;

    // let isQ = false;
    let letterVars = getLetterVars(logStr1+' > '+logStr2);
    let submission;
	let answer;
	let interpretation = {};

    function checkSubmission() {

        if(answer === undefined){
            submission.log('warn', "Select an option.");
            return;
        }

		if(!answer){

            for(const i in letterVars){
                if(interpretation[letterVars[i]] === undefined){
                    submission.log('warn', "Provided interpretation is incomplete.");
                    return;
                }
            }
			
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

<ProblemWrapper bind:submission on:click={checkSubmission} {problem} {number} {isAdmin}>
    <div slot="description">
        <p>Does schema (1) imply schema (2)?</p>
        <div class="description-line"><span class="description-line-marker">1.</span> <span class="logStr">{dispLogStr(logStr1, $connectives)}</span></div>
        <div class="description-line"><span class="description-line-marker">2.</span> <span class="logStr">{dispLogStr(logStr2, $connectives)}</span></div>
        <p>If implication fails to hold, provide an interpretation that witnesses this fact.</p>
    </div>
	
    <div slot="submission-input">
        <!-- {#if !isQ} 
            <HiddenTruthTable logStr={'[' + logStr1 + '] > [' + logStr2 + ']'} />   
        {/if}
        -->
            
        <HiddenTruthTable logStr={'[' + logStr1 + '] > [' + logStr2 + ']'} />

        <div class="submission-input-line">
            <div class="mb2">
                <input class="mr2" type=radio bind:group={answer} name="implies" value={true} />
                <label for={true} class="lh-copy">Implies</label>
            </div>
            <div class="mb2">
                <input class="mr2" type=radio bind:group={answer} name="implies" value={false} />
                <label for={false} class="lh-copy">Does not imply...</label>
            </div>

            <div class="extra-question-wrapper pb2 pl4" hidden={answer!=false}>
                <div class="extra-question-message f6 black-50 pb2">...as shown with interpretation:</div>
                <TruthAssignmentInput {letterVars} bind:interpretation />
            </div>
        </div>
    </div>

</ProblemWrapper>