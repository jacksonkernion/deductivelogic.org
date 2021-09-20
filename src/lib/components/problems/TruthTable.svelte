<script>
    import TruthTableInput from '$lib/components/problems/sub-components/TruthTableInput.svelte';
    import ProblemWrapper from '$lib/components/problems/sub-components/ProblemWrapper.svelte';
    
    import {getLetterVars, parseLogStr, tVal} from '$lib/logic.js';
    import {dispLogStr} from '$lib/utils';
    import { connectives } from '$lib/stores';

    export let problem, number, isAdmin;
    let logStr = problem.logStr;
    
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

        let submissionError = false;
        
		for(let i=0; i < tTableData.tAnswerRows.length; i++){

            let answer = tTableData.tAnswerRows[i][tTableData.tAnswerRows[i].length-1];
            
            if(answer === null){
                submission.log('warn', "Not all rows of the truth table have been completed.");
                submissionError = true;
                return;
            }
            

            let tValues = {};
            for(let j=0; j < tTableData.letterVars.length; j++){
                tValues[tTableData.letterVars[j]] = tTableData.tAssignmentRows[i][j];
            }

            let correctResult = tVal(logProp, tValues);
            
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

<ProblemWrapper bind:submission on:click={checkSubmission} {problem} {number} {isAdmin}>
    <div slot="description">
        <p>Construct a truth table for <span class='logStr'>{dispLogStr(logStr, $connectives)}</span></p>
    </div>
    <div slot="submission-input">
        <TruthTableInput bind:tTableData />
    </div>
</ProblemWrapper>