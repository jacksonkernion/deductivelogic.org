<script>
    import {parseLogStr} from '$lib/logic.js';
    import {getLetterVars} from '$lib/logic.js';
    import {validity} from '$lib/logic.js';
    import LogStrInput from '$lib/components/LogStrInput.svelte';

    export let logStr;
    export let question;
    export let sentSet = '';
    export let logStrSet = '';
    export let number;

    let sentSetArr = sentSet.split(',')
    let logStrSetArr = logStrSet.split(',');
    let conclusionSent = question;
    let conclusionLogStr = logStr;

    let studentLogStrSet = [];
    let studentConclusionLogStr = '';
    let implication = false;

    let submissionVerdict = '';
    let submissionMessage = '';

    $: correctLogStrArr = [...logStrSetArr, conclusionLogStr];
    $: studentLogStrArr = [...studentLogStrSet, studentConclusionLogStr];

    function permutator(inputArr) {
        var results = [];

        function permute(arr, memo) {
            var cur, memo = memo || [];

            for (var i = 0; i < arr.length; i++) {
            cur = arr.splice(i, 1);
            if (arr.length === 0) {
                results.push(memo.concat(cur));
            }
            permute(arr.slice(), memo.concat(cur));
            arr.splice(i, 0, cur[0]);
            }

            return results;
        }

        return permute(inputArr);
    }

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

        // Check overall number of vars matches
		var correctVars = getLetterVars(correctLogStrArr.join(' . '));
		var studentVars = getLetterVars(studentLogStrArr.join(' . '));
			
		if(correctVars.length != studentVars.length){
            submissionMessage = "Hmm...You don't seem to have the correct number of letters in your paraphrasing!";
            return;
        }
 
        // Check the student paraphase of English sentences, abtracting away variable letter choice; report which one is wrong if wrong

        for(var i = 0; i < correctLogStrArr.length; i++){
            var correctStr = correctLogStrArr[i];
            var studentStr = studentLogStrArr[i];

            if(!parseLogStr(studentStr)){
                if(i < (correctLogStrArr.length - 1)){
                    submissionMessage = "Schema (" + (i + 1) + ") could not be understood.";
                    return;
                }
                else{
                    submissionMessage = "Schema (C) could not be understood.";
                    return;
                }
            }
        
            var correctVars = getLetterVars(correctStr);
            var studentVars = getLetterVars(studentStr);
            
            if(correctVars.length != studentVars.length){
                submissionMessage = "Hmm...You don't seem to have the correct number of letters in your paraphrasing.";
                return;
            }
            
            var match = false;
            var testVarsArr = permutator(correctVars);
            
            for(var testVars of testVarsArr){
			    var testStr = studentStr;
			    var varPositions = [];
                
			    for(var studentVar of studentVars){
				    varPositions.push(findChars(studentStr, studentVar));
			    }
                for(var i = 0; i < testVars.length; i++){
				    for(var varPosition of varPositions[i]){
                        testStr = testStr.substring(0, varPosition[0]) + testVars[i] + testStr.substring(varPosition[1]+1);
				    }
			    }
                
                //Evaluate equivalency
                if(validity('('+correctStr+') <> ('+testStr+')')){
                    match = true;
                    //Break the for loop here
                    i = correctLogStrArr.length;
                }
            }
            if(!match){
                submissionMessage = "Wrong. Your paraphrase of ("+ (i + 1) + ") looks wrong.";
                return;
            }
        }

        // Check implication of conclusion

        var bigLogStr = '';
		
		for(var i = 0; i < studentLogStrSet.length; i++){
		
			if(i == 0)
				bigLogStr += "(" + studentLogStrSet[i] + ")";
			else
                bigLogStr += " . (" + studentLogStrSet[i] + ")";
		}
		
		bigLogStr = "(" + bigLogStr + ") > (" + studentConclusionLogStr + ")";
		
		var implies = validity(bigLogStr);
		
		if(!implication){
			if(!implies){
				submissionMessage = "Correct.";
                return;
			}
            else{
                submissionMessage = "Incorrect.";
                return;
            }
		}
		else if(implication){
			if(implies){
				submissionMessage = "Correct.";
                return;
			}
			else{
                submissionMessage = "Incorrect.";
                return;
            }
		}
        
    }

</script>

<p>{number}. For the following argument, paraphrase the premises and conclusion and also determine whether the premises truth-functionally imply the conclusion.</p>

{#each sentSetArr as sent, i}
    <div class="description_line">
        {i+1}. {sent}
    </div>
{/each}
<div class="description_line">
    C. {conclusionSent}
</div>
<div class="problem-answer">
    {#each logStrSetArr as logStr, i}
        <div>
            {i+1}. <LogStrInput bind:logStr={studentLogStrSet[i]}/>
        </div>
    {/each}
    <div>
        C. <LogStrInput bind:logStr={studentConclusionLogStr}/>
    </div>

    Implies? <input type=checkbox bind:checked={implication} /> 
    
    <div class="tc ma4">
        <button class="f6 br1 ba ph3 pv2 mb2 dib black" on:click={checkSubmission}>Check</button>
        <p>{submissionMessage}</p>
    </div>
</div>