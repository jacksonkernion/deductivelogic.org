<script>
    import TruthTableInput from '$lib/components/problems/sub-components/TruthTableInput.svelte';
    
    import {getLetterVars, parseLogStr, tVal} from '$lib/logic.js';
    import {dispLogStr} from '$lib/utils';
    import { connectives } from '$lib/stores';

    export let problem;
    export let submission;
    let logStr = problem.logStr;
    
    let logProp = parseLogStr(logStr);
    
    let tTableData = {
        logStr: logStr,
        logSubStrs: [],
        letterVars: getLetterVars(logStr),
        tAssignmentRows: [],
        tAnswerRows: []
    };

    submission.check = function() {

        let submissionError = false;
        
		for(let i=0; i < tTableData.tAnswerRows.length; i++){

            let answer = tTableData.tAnswerRows[i][tTableData.tAnswerRows[i].length-1];
            
            if(answer === null){
                this.log('warn', "Not all rows of the truth table have been completed.");
                submissionError = true;
                return;
            }
            

            let tValues = {};
            for(let j=0; j < tTableData.letterVars.length; j++){
                tValues[tTableData.letterVars[j]] = tTableData.tAssignmentRows[i][j];
            }

            let correctResult = tVal(logProp, tValues);
            
			if(answer != correctResult){
                this.log('incorrect', "Incorrect");
                submissionError = true;
                return;
			}
        }    
        if(!submissionError){
            this.log('correct');
            return;
        }
    }
</script>


<div class="lh-copy">
    <p>Construct a truth table for <span class='logStr'>{dispLogStr(logStr, $connectives)}</span></p>
</div>
<div class="submission-input">
    <TruthTableInput bind:tTableData />
</div>