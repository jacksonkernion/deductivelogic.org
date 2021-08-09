<script>
    import LogStrInput from '$lib/components/LogStrInput.svelte';
    import ProblemWrapper from '$lib/components/ProblemWrapper.svelte';

    import {validity, parseLogStr, getLetterVars} from '$lib/logic.js';
    import { permutator } from '$lib/helpers.js';

    export let logStr;
    export let question;
    export let sentSet = '';
    export let logStrSet = '';
    export let number;

    let sentSetArr = sentSet.split('/')
    let logStrSetArr = logStrSet.split(',');
    let conclusionSent = question;
    let conclusionLogStr = logStr;

    let studentLogStrSet = [];
    let studentConclusionLogStr = '';
    let implication = false;

    let submission;

    $: correctLogStrArr = [...logStrSetArr, conclusionLogStr];
    $: studentLogStrArr = [...studentLogStrSet, studentConclusionLogStr];

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
            submission.log('warn', "Hmm...You don't seem to have the correct number of letters in your paraphrasing.");
            return;
        }
 
        // Check the student paraphase of English sentences, abtracting away variable letter choice; report which one is wrong if wrong

        for(var i = 0; i < correctLogStrArr.length; i++){
            var correctStr = correctLogStrArr[i];
            var studentStr = studentLogStrArr[i];

            var lineMarker = '(' + (i + 1) + ')';
            if(i == (correctLogStrArr.length - 1)){
                lineMarker = "(C)";
            }

            if(!parseLogStr(studentStr)){
                submission.log('warn', "Schema "+lineMarker+" could not be understood.");
                return;
            }
        
            var correctVars = getLetterVars(correctStr);
            var studentVars = getLetterVars(studentStr);
            
            if(correctVars.length != studentVars.length){
                submission.log('warn', "Incorrect number of letters in your paraphrasing of schema " + lineMarker + ".");
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
                submission.log('incorrect', "Paraphrase of "+lineMarker+" is incorrect.");
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
				submission.log('correct', 'Correct');
                return;
			}
            else{
                submission.log('incorrect', 'Incorrect');
                return;
            }
		}
		else if(implication){
			if(implies){
				submission.log('correct', 'Correct');
                return;
			}
			else{
                submission.log('incorrect', 'Incorrect');
                return;
            }
		}
        
    }

</script>

<ProblemWrapper bind:submission on:click={checkSubmission} {number}>
    <div slot="description">
        <p>For the following argument, paraphrase the premises and conclusion and also determine whether the premises truth-functionally imply the conclusion.</p>
        {#each sentSetArr as sent, i}
            <div class="description-line">
                <span class="description-line-marker">{i+1}.</span> {sent}
            </div>
        {/each}
        <div class="description-line">
            <span class="description-line-marker">C.</span> {conclusionSent}
        </div>
    </div>
	
    <div slot="submission-input">
        {#each logStrSetArr as logStr, i}
            <div class="relative">
                <span class="absolute left-1">{i+1}.</span> <LogStrInput bind:logStr={studentLogStrSet[i]}/>
            </div>
        {/each}
        <div class="relative">
            <span class="absolute left-1">C.</span> <LogStrInput bind:logStr={studentConclusionLogStr}/>
        </div>
        
        <div class="flex w5 center items-center mb2">
            <input class="mr2" type=radio bind:group={implication} name="implies" value={true} />
            <label for={true} class="lh-copy">Implies</label>
        </div>
        <div class="flex w5 center items-center mb2">
            <input class="mr2" type=radio bind:group={implication} name="implies" value={false} />
            <label for={false} class="lh-copy">Does not imply</label>
        </div>
    </div>

</ProblemWrapper>