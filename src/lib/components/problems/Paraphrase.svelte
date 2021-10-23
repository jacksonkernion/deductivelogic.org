<script>

    import LogStrInput from '$lib/components/problems/sub-components/LogStrInput.svelte';
    
    import {parseLogStr, getLetterVars, validity} from '$lib/logic.js';
    import {dispLogStr, findChars, permutator} from '$lib/utils';
    import {connectives} from '$lib/stores';

    export let problem, submission;
    let sent = problem.sent;
    let logStr = problem.logStr;

    let studentLogStr = '';

    submission.check = function(){

        if(!parseLogStr(studentLogStr))
            this.log('warn', "Could not parse schema: "+dispLogStr(studentLogStr, $connectives));
		
		var correctVars = getLetterVars(logStr);
		var studentVars = getLetterVars(studentLogStr);
		
		if(correctVars.length != studentVars.length){
			this.log('warn', "Hmm...You don't seem to have the correct number of letters.");
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
				this.log('correct');
                return;
			}
		}
		this.log('incorrect', 'Incorrect');
        return;
    }
</script>



<div class="lh-copy">
    <p>Paraphrase the following sentence in logical notation:</p>
    <p class="description-line">{sent}</p>
</div>
<div class="submission-input">
    <div class="submission-input-line">
        <LogStrInput bind:logStr={studentLogStr} />
    </div>
    
</div>