<script>

    import TruthAssignmentInput from '$lib/components/TruthAssignmentInput.svelte';
    import HiddenTruthTable from '$lib/components/HiddenTruthTable.svelte';
    import ProblemWrapper from '$lib/components/ProblemWrapper.svelte';

    import {tVal, validity, parseLogStr, getLetterVars} from '$lib/logic.js';
    import {dispLogStr} from '$lib/helpers.js';

    export let logStr1 = '';
    export let logStr2 = '';
    export let number = '';

    let letterVars = getLetterVars(logStr1+' <> '+logStr2);
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
			if(!tVal(parseLogStr('('+logStr1+') <> ('+logStr2+')'), interpretation)){
				submission.log('correct', "Correct");
                return;
			}
            else{
                submission.log('incorrect', "Incorrect");
                return;
            }
		}
		else if(answer){
			//Evaluate validity of biconditional
			if(validity('('+logStr1+') <> ('+logStr2+')')){
				submission.log('correct', "Correct");
			}
			else{
				submission.log('incorrect', "Incorrect");
			}
		}
	}
	
</script>


<ProblemWrapper bind:submission on:click={checkSubmission} {number}>
    <div slot="description">
        <p>Determine whether schema (1) and schema (2) are equivalent:</p>
        <div class="description-line"><span class="description-line-marker">1.</span> <span class="logStr">{dispLogStr(logStr1)}</span></div>
        <div class="description-line"><span class="description-line-marker">2.</span> <span class="logStr">{dispLogStr(logStr2)}</span></div>
        <p>If equivalence fails to hold, provide an interpretation that witnesses this fact.</p>
    </div>
	
    <div slot="submission-input">
        
        <HiddenTruthTable logStr={'[' + logStr1 + '] > [' + logStr2 + ']'} />   
        
        <div class="submission-input-line">
            <div class="mb2">
                <input class="mr2" type=radio bind:group={answer} name="implies" value={true} />
                <label for={true} class="lh-copy">Equivalent</label>
            </div>
            <div class="mb2">
                <input class="mr2" type=radio bind:group={answer} name="implies" value={false} />
                <label for={false} class="lh-copy">Not equivalent...</label>
            </div>

            <div class="extra-question-wrapper pb2 pl4" hidden={answer!=false}>
                <div class="extra-question-message f6 black-50 pb2">...as shown with interpretation:</div>
                <TruthAssignmentInput {letterVars} bind:interpretation />
            </div>
        </div>
    </div>

</ProblemWrapper>