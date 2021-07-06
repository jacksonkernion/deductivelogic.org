<script>
    import TruthTableInput from '$lib/components/TruthTableInput.svelte';
    import {getLetterVars} from '$lib/logic.js';
    import {parseLogStr} from '$lib/logic.js';
    import {tVal} from '$lib/logic.js';
    import {dispLogStr} from '$lib/logic.js';

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
    
    //export let toAnswerArray = [logStr];

    let submissionVerdict = '';
    let submissionMessage = '';

    function logSubmission(verdict, message) {
        // Store submission data somewhere???
        submissionVerdict = verdict;
        submissionMessage = message;
    }

    function checkSubmission() {

        var submissionError = false;

        //console.log(tTableData);
        
		for(var i=0; i < tTableData.tAnswerRows.length; i++){
            var tValues = {};
            for(var j=0; j < tTableData.letterVars.length; j++){
                tValues[tTableData.letterVars[j]] = tTableData.tAssignmentRows[i][j];
            }

            var correctResult = tVal(logProp, tValues);

			if(tTableData.tAnswerRows[i][tTableData.tAnswerRows[i].length-1] != correctResult){
                
                logSubmission('incorrect', "Incorrect");
                submissionError = true;
                return;
			}
        }    
        if(!submissionError){
            logSubmission('correct', "Correct");
            return;
        }
    }
</script>

<li class="lh-copy pv3 bt b--black-10">
    <p>{number}. Construct a truth table for {dispLogStr(logStr)}</p>
    <div>
        <TruthTableInput bind:tTableData />
    </div>
    <div class="tc ma4">
        <button class="f6 br1 ba ph3 pv2 mb2 dib black" on:click={checkSubmission}>Check</button>
        <p>{submissionMessage}</p>
    </div>
    
</li>