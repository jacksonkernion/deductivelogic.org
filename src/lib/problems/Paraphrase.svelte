<script>

    import LogStrInput from '$lib/components/LogStrInput.svelte';
    import ProblemWrapper from '$lib/components/ProblemWrapper.svelte';
    
    import {parseLogStr, dispLogStr, getLetterVars, validity} from '$lib/logic.js';
    import {permutator} from '$lib/helpers.js';
    
    export let question = '';
    export let logStr = '';
    export let number = '';

    let studentLogStr = '';

    let submission;

    function findChars(haystack, needle, offset=0){

        var pos = haystack.indexOf(needle, offset);

        //base case
        if(pos === -1){
            return false;
        }
        //recursion
        else{
            var littleArr = [pos, pos + needle.length - 1];
            var arr = [littleArr];
            var otherArr = findChars(haystack, needle, pos + needle.length);
            if(otherArr){
                for(var littleArr of otherArr){
                    arr.push(littleArr);
                }
            }
            return arr;
        }

    }


    function checkSubmission(){

        if(!parseLogStr(studentLogStr))
            submission.log('warn', "Could not parse schema: "+dispLogStr(studentLogStr));
		
		// If it's Q, to get leter vars, remove all capital letters
		/* if(logic::isQ($correct_str)){
			if(logic::quant_paraphrase($correct_str, $student_str))
				$this->respond('correct', $problem);
			else
				$this->respond('incorrect', $problem);
		}
        */
		
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
            console.log('('+logStr+') <> ('+testStr+')');
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
        <div class="description-line">{question}</div>
    </div>
	<div slot="submission-input">
        <LogStrInput bind:logStr={studentLogStr} />
    </div>
</ProblemWrapper>