<script>

    import TruthAssignmentInput from '$lib/components/TruthAssignmentInput.svelte';
    import HiddenTruthTable from '$lib/components/HiddenTruthTable.svelte';
    import ProblemWrapper from '$lib/components/ProblemWrapper.svelte';

    import {tVal, validity, parseLogStr, getLetterVars} from '$lib/logic.js';
    import {dispLogStr} from '$lib/helpers.js';

    export let logStr = '';
    export let number = '';

	let letterVars = getLetterVars(logStr1+' <> '+logStr2);
    let submission;
	let answer = true;
	let interpretation = {};

    function checkSubmission() {
        if(!answer){
            
            //Evaluates if false on provided assignments
            if(!tVal(parseLogStr(logStr), interpretation)){
                submission.log('correct', "Correct");
                return;
            }
            else{
                submission.log('incorrect', "Incorrect");
                return;
            }
        }
        else if(answer){
            //Evaluate validity
            if(validity(logStr)){
                submission.log('correct', "Correct");
                return;
            }
            else{
                submission.log('incorrect', "Incorrect");
                return;
            }
        }
    }

</script>

<ProblemWrapper bind:submission on:click={checkSubmission} {number}>
    <div slot="description">
        <p>Test the following schema for validity:</p>
        <div class="description-line">{dispLogStr(logStr)}</div>
        <p>If not valid, provide an interpretation under which the schema is false.</p>
    </div>
	
    <div slot="submission-input" class="tc">
        
        <HiddenTruthTable {logStr} />   
        
        <div class="flex w5 center items-center mb2">
            <input class="mr2" type=radio bind:group={answer} name="implies" value={true} />
            <label for={true} class="lh-copy">Valid</label>
        </div>
        <div class="flex w5 center items-center mb2">
            <input class="mr2" type=radio bind:group={answer} name="implies" value={false} />
            <label for={false} class="lh-copy">Not valid...</label>
        </div>

        <div class="extra-question-wrapper pb2" hidden={answer}>
            <div class="extra-question-message f6 black-50 pb2">...as shown with interpretation:</div>
            <TruthAssignmentInput {letterVars} bind:interpretation />
        </div>
    </div>

</ProblemWrapper>