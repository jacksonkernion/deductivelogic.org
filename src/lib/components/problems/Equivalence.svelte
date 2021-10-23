<script>

    import TruthAssignmentInput from '$lib/components/problems/sub-components/TruthAssignmentInput.svelte';
    import HiddenTruthTable from '$lib/components/problems/sub-components/HiddenTruthTable.svelte';

    import {tVal, validity, parseLogStr, getLetterVars} from '$lib/logic.js';
    import {dispLogStr} from '$lib/utils';
    import {connectives} from '$lib/stores';

    export let problem, submission;

    let logStr1 = problem.logStr1;
    let logStr2 = problem.logStr2;

    let letterVars = getLetterVars(logStr1+' <> '+logStr2);
	let answer;
	let interpretation = {};

    submission.check = function() {

        if(answer === undefined){
            this.log('warn', "Select an option.");
            return;
        }

		if(!answer){

            for(const i in letterVars){
                if(interpretation[letterVars[i]] === undefined){
                    this.log('warn', "Provided interpretation is incomplete.");
                    return;
                }
            }
			
			//Evaluates if false on provided assignments
			if(!tVal(parseLogStr('('+logStr1+') <> ('+logStr2+')'), interpretation)){
				this.log('correct');
                return;
			}
            else{
                this.log('incorrect', "Incorrect");
                return;
            }
		}
		else if(answer){

			//Evaluate validity of biconditional
			if(validity('('+logStr1+') <> ('+logStr2+')')){
				this.log('correct');
			}
			else{
				this.log('incorrect', "Incorrect");
			}
		}
	}
	
</script>



<div class="lh-copy">
    <p>Determine whether schema (1) and schema (2) are equivalent:</p>
    <div class="description-line"><span class="description-line-marker">1.</span> <span class="logStr">{dispLogStr(logStr1, $connectives)}</span></div>
    <div class="description-line"><span class="description-line-marker">2.</span> <span class="logStr">{dispLogStr(logStr2, $connectives)}</span></div>
    <p>If equivalence fails to hold, provide an interpretation that witnesses this fact.</p>
</div>

<div class="submission-input">
    
    <HiddenTruthTable logStr={'[' + logStr1 + '] <> [' + logStr2 + ']'} />   
    
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
