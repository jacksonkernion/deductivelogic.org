<script>
    import LogStrInput from '$lib/components/LogStrInput.svelte';
    import ProblemWrapper from '$lib/components/ProblemWrapper.svelte';

    import {validity, parseLogStr, getLetterVars} from '$lib/logic.js';
    import {findChars, permutator} from '$lib/helpers.js';

    export let logStr;
    export let sent;
    export let sentSet = [];
    export let logStrSet = [];
    export let number;

    let conclusionSent = sent;
    let conclusionLogStr = logStr;

    let studentLogStrSet = [];
    let studentConclusionLogStr = '';
    let implication;

    let submission;

    //$: correctLogStrArr = [...logStrSet, conclusionLogStr];
    let correctLogStrArr = [...logStrSet, conclusionLogStr];
    $: studentLogStrArr = [...studentLogStrSet, studentConclusionLogStr];

    function checkSubmission(){

        // first, do basic check of number of letter vars in each logStr pair
        for(var i = 0; i < correctLogStrArr.length; i++){
            var correctVars = getLetterVars(correctLogStrArr[i]);
            var studentVars = getLetterVars(studentLogStrArr[i]);
            
            if(correctVars.length != studentVars.length){
                var lineMarker = '(' + (i + 1) + ')';
                if(i == (correctLogStrArr.length - 1)){
                    lineMarker = "(C)";
                }
                submission.log('warn', "Incorrect number of letters in your paraphrasing of "+lineMarker+".");
                return;
            }
        }

        // Check overall number of vars matches
        var correctVars = getLetterVars(correctLogStrArr.join(' . '));
        var studentVars = getLetterVars(studentLogStrArr.join(' . '));
            
        if(correctVars.length != studentVars.length){
            submission.log('warn', "Total number of letters used across paraphrased lines does not match correct total number.");
            return;
        }

        // Go through each permutation of correct vars, try to find mapping where each logStr pair matches
        var testVarsArr = permutator(correctVars);
        for(var i=0; i < testVarsArr.length; i++){
            var testVars = testVarsArr[i];
            var allMatch = false;
            var matches = [];

            for(var j = 0; j < studentLogStrArr.length; j++){
                var correctStr = correctLogStrArr[j];
                var studentStr = studentLogStrArr[j];
                matches[j] = false;

                // Throw error if submitted logStr can't be parsed
                if(!parseLogStr(studentStr)){
                    submission.log('warn', "Schema "+lineMarker+" could not be understood.");
                    return;
                }
                
                var testStr = studentStr;
                var varPositions = [];
                var varPositions = studentVars.map((studentVar) => {
                    return findChars(studentStr, studentVar);
                });
                
                //replace each variable of studenLogStr with a var from current permutation of correctVars
                for(var k = 0; k < testVars.length; k++){
                    //if varPositions[k] *is* false, that means it's a var used in a different schema, not this one...
                    if(varPositions[k] != false){
                        for(var varPosition of varPositions[k]){
                                testStr = testStr.substring(0, varPosition[0]) + testVars[k] + testStr.substring(varPosition[1]+1);
                        }
                    }
                }

                //If not a match, jump to next testVars permutation...
                if(!validity('('+correctStr+') <> ('+testStr+')')){
                    j = testVarsArr.length;
                }
                // if a match on final logStr in set
                else if((j + 1) == studentLogStrArr.length){
                    matches[j] = true;
                    allMatch = true;
                    //stop running through permutations
                    i = testVarsArr.length;
                }
                // if a match
                else{
                    matches[j] = true;
                }
            }
        }
        if(!allMatch){
            submission.log('incorrect', "At least one paraphrase is incorrect.");
            return;
            //The reasons I *don't* provide the paraphrasing line that did not result in a match, is because earlier line may 'accidentally' match, meaning that we can't in principle find the exact line of mismatch. Ex: correct = p.r/q.-r & student = p.q/q.-r
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
        {#each sentSet as sentence, i}
            <div class="description-line">
                <span class="description-line-marker">{i+1}.</span> <span class="serif">{sentence}</span>
            </div>
        {/each}
        <div class="description-line">
            <span class="description-line-marker">C.</span> <span class="serif">{conclusionSent}</span>
        </div>
    </div>
	
    <div slot="submission-input">
        {#each logStrSet as logStr, i}
            <div class="relative submission-input-line">
                <span class="description-line-marker mt2">{i+1}.</span> <LogStrInput bind:logStr={studentLogStrSet[i]}/>
            </div>
        {/each}
        <div class="relative submission-input-line">
            <span class="description-line-marker mt2">C.</span> <LogStrInput bind:logStr={studentConclusionLogStr}/>
        </div>
        <div class="submission-input-line">
            <div class="mb2 mt4">
                <input class="mr2" type=radio bind:group={implication} name="implies" value={true} />
                <label for={true} class="lh-copy">Implies</label>
            </div>
            <div class="mb2">
                <input class="mr2" type=radio bind:group={implication} name="implies" value={false} />
                <label for={false} class="lh-copy">Does not imply</label>
            </div>
        </div>
    </div>

</ProblemWrapper>