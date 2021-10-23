<script>

    import TruthAssignmentInput from '$lib/components/problems/sub-components/TruthAssignmentInput.svelte';
    import HiddenTruthTable from '$lib/components/problems/sub-components/HiddenTruthTable.svelte';

    import {tVal, validity, parseLogStr, getLetterVars} from '$lib/logic.js';
    import {dispLogStr} from '$lib/utils';
    import {connectives} from '$lib/stores';

    export let problem, submission;
    let logStr = problem.logStr;

	let letterVars = getLetterVars(logStr);
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
            if(!tVal(parseLogStr(logStr), interpretation)){
                this.log('correct');
                return;
            }
            else{
                this.log('incorrect', "Incorrect");
                return;
            }
        }
        else if(answer){
            //Evaluate validity
            if(validity(logStr)){
                this.log('correct');
                return;
            }
            else{
                this.log('incorrect', "Incorrect");
                return;
            }
        }
    }

</script>

<div class="lh-copy">
    <p>Test the following schema for validity:</p>
    <div class="description-line logStr">{dispLogStr(logStr, $connectives)}</div>
    <p>If not valid, provide an interpretation under which the schema is false.</p>
</div>

<div class="submission-input">
    
    <HiddenTruthTable {logStr} />   
    
    <div class="submission-input-line">
        <div class="mb2">
            <input class="mr2" type=radio bind:group={answer} name="implies" value={true} />
            <label for={true} class="lh-copy">Valid</label>
        </div>
        <div class="mb2">
            <input class="mr2" type=radio bind:group={answer} name="implies" value={false} />
            <label for={false} class="lh-copy">Not valid...</label>
        </div>

        <div class="extra-question-wrapper pb2 pl4" hidden={answer!=false}>
            <div class="extra-question-message f6 black-50 pb2">...as shown with interpretation:</div>
            <TruthAssignmentInput {letterVars} bind:interpretation />
        </div>
    </div>
</div>