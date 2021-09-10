<script>

    import LogStrInput from '$lib/components/problems/sub-components/LogStrInput.svelte';
    import ProblemWrapper from '$lib/components/problems/sub-components/ProblemWrapper.svelte';
    
    import {parseLogStr, getLetterVars, validity} from '$lib/logic.js';
    import {dispLogStr, findChars, permutator} from '$lib/utils';

    
    export let sent = '';
    export let logStr = '';
    export let number = '';

    let studentLogStr = '';
    let submission;

    function checkSubmission(){

        if(!parseLogStr(studentLogStr))
            submission.log('warn', "Could not parse schema: "+dispLogStr(studentLogStr));
		
		var correctVars = getLetterVars(logStr);
		var studentVars = getLetterVars(studentLogStr);
		
		if(correctVars.length != studentVars.length){
			submission.log('warn', "Hmm...You don't seem to have the correct number of letters.");
            return;
		}
		
		var testVarsArr = permutator(correctVars);
		
		for(var testVars of testVarsArr){
			var testStr = studentLogStr;
			
			var varPositions = [];
			
			for(var studentVar of studentVars){
				varPositions.push(findChars(studentLogStr, studentVar));
			}
			for(var i = 0; i < testVars.length; i++){
				for(var varPosition of varPositions[i]){
                    testStr = testStr.substring(0, varPosition[0]) + testVars[i] + testStr.substring(varPosition[1]+1);
				}
			}
			
			//Evaluate equivalency
			if(validity('('+logStr+') <> ('+testStr+')')){
				submission.log('correct', 'Correct');
                return;
			}
		}
		submission.log('incorrect', 'Incorrect');
        return;
    }
</script>


<ProblemWrapper bind:submission on:click={checkSubmission} {number}>
    <div slot="description">
        <p>Paraphrase the following sentence in logical notation:</p>
        <p class="description-line">{sent}</p>
    </div>
	<div slot="submission-input" class="submission-input-line">
        <LogStrInput bind:logStr={studentLogStr} />
    </div>
</ProblemWrapper>