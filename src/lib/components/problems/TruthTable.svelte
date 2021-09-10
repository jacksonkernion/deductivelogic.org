<script>
    import TruthTableInput from '$lib/components/problems/sub-components/TruthTableInput.svelte';
    import ProblemWrapper from '$lib/components/problems/sub-components/ProblemWrapper.svelte';
    
    import {getLetterVars, parseLogStr, tVal} from '$lib/logic.js';
    import {dispLogStr} from '$lib/utils';

    export let logStr = '';
    export let number = '';
    
    let logProp = parseLogStr(logStr);
    
    let tTableData = {
        logStr: logStr,
        logSubStrs: [],
        letterVars: getLetterVars(logStr),
        tAssignmentRows: [],
        tAnswerRows: []
    };

    let submission;

    function checkSubmission() {

        var submissionError = false;
        
		for(var i=0; i < tTableData.tAnswerRows.length; i++){

            var answer = tTableData.tAnswerRows[i][tTableData.tAnswerRows[i].length-1];
            
            if(answer === null){
                submission.log('warn', "Not all rows of the truth table have been completed.");
                submissionError = true;
                return;
            }
            

            var tValues = {};
            for(var j=0; j < tTableData.letterVars.length; j++){
                tValues[tTableData.letterVars[j]] = tTableData.tAssignmentRows[i][j];
            }

            var correctResult = tVal(logProp, tValues);

			if(answer != correctResult){
                submission.log('incorrect', "Incorrect");
                submissionError = true;
                return;
			}
        }    
        if(!submissionError){
            submission.log('correct', "Correct");
            return;
        }
    }
</script>

<ProblemWrapper bind:submission on:click={checkSubmission} {number}>
    <div slot="description">
        <p>Construct a truth table for <span class='logStr'>{dispLogStr(logStr)}</span></p>
    </div>
    <div slot="submission-input">
        <TruthTableInput bind:tTableData />
    </div>
</ProblemWrapper>