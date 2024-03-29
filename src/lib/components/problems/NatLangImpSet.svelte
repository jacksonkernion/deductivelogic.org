<script>
    
    import LogStrInput from '$lib/components/problems/sub-components/LogStrInput.svelte';
    import Button from '$lib/components/atoms/Button.svelte';

    import {permutator, findChars} from '$lib/utils';
	import {parseLogStr, validity, getLetterVars} from '$lib/logic.js';
    
    export let problem, submission;
    let sentSet = problem.sentSet;
    let logStrSet = problem.logStrSet;
    let studentLogStrSet = [];
    let answersArr = [[1,1]];

    $: correctImpArr = getCorrectImpArr(logStrSet);

    function getCorrectImpArr(logStrSetArr){
        let correctArr = [];

        logStrSetArr.map(function(element, i, arr) {
            arr.forEach(function(el, j) {
                if(validity("("+arr[i]+') > ('+arr[j]+")") && arr[i] != arr[j]){
                    // correct for 0-index to 1-index
                    var a = i + 1;
                    var b = j + 1;
                    correctArr = [...correctArr, [a, b]];
                }
            });
        });
        return correctArr;
    }

    function addImplication(){
       answersArr = [...answersArr, [1,1]];
    }

    function removeImplication(i){
       answersArr.splice(i, 1);
       answersArr = answersArr;
    }

    submission.check = function(){
        // I've removed logic to allow the specfication, in error message, of the specific paraphrase line that is wrong
        /*  var lineMarker = '(' + (i + 1) + ')';
            if(i == (correctLogStrArr.length - 1)){
                lineMarker = "(C)";
            }
        */

        // Check the student paraphrase of English sentences, abtracting away variable letter choice

        // first, do basic check of number of letter vars in each logStr pair
        for(var i = 0; i < logStrSet.length; i++){
            var correctVars = getLetterVars(logStrSet[i]);
            var studentVars = getLetterVars(studentLogStrSet[i]);
            
            if(correctVars.length != studentVars.length){
                this.log('warn', "Incorrect number of letters in your paraphrasing of ("+(i + 1)+").");
                return;
            }
        }

        // Check that overall number of vars matches
        var correctVars = getLetterVars(logStrSet.join(' . '));
        var studentVars = getLetterVars(studentLogStrSet.join(' . '));

        if(correctVars.length != studentVars.length){
            this.log('warn', "Total number of letters used across paraphrased lines does not match correct total number.");
            return
        }

        // Go through each permutation of correct vars, try to find mapping where each logStr pair matches
        var testVarsArr = permutator(correctVars);
        for(var i=0; i < testVarsArr.length; i++){
            var testVars = testVarsArr[i];
            var allMatch = false;
            var matches = [];

            for(var j = 0; j < studentLogStrSet.length; j++){
                var correctStr = logStrSet[j];
                var studentStr = studentLogStrSet[j];
                matches[j] = false;

                // Throw error if submitted logStr can't be parsed
                if(!parseLogStr(studentStr)){
                    this.log('warn', "Schema "+lineMarker+" could not be understood.");
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
                else if((j + 1) == studentLogStrSet.length){
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
            this.log('incorrect', "At least one paraphrase is incorrect.");
            return;
            //The reasons I *don't* provide the paraphrasing line that did not result in a match, is because earlier line may 'accidentally' match, meaning that we can't in principle find the exact line of mismatch. Ex: correct = p.r/q.-r & student = p.q/q.-r
        }
            
        //check if implications are right...

        //Check that they don't have any self-implications, duplicates
        for(var i in answersArr){
            var imp = answersArr[i];
            if(imp[0] == imp[1]){
                this.log('warn', "Please don't include self-implications (Ex. n implies n)");
                return;
            }
            for(var j in answersArr){
                if(j != i){
                    if(imp[0] == answersArr[j][0] && imp[1] == answersArr[j][1]){
                        this.log('warn', "Remove duplicate: '("+imp[0]+') implies ('+imp[1]+")'");
                        return;
                    }
                }
            }
        }


        //Check that they have no extraneous implications
        for(var imp1 of answersArr){
            if(!correctImpArr.some((imp2) => imp1[0] == imp2[0] && imp1[1] == imp2[1])){
                this.log('incorrect', "Some of your implications are wrong.");
                return;
            }
        }

        //check that they have all the implications
        for(var imp1 of correctImpArr){
            if(!answersArr.some((imp2) => imp1[0] == imp2[0] && imp1[1] == imp2[1])){
                this.log('incorrect', "You're missing some implications.");
                return;
            }
        }

        this.log('correct');
        return;
    }
	

</script>

<div class="lh-copy">
    <p>Paraphrase the following natural language sentences and then determine any implications that hold between them.</p>
    {#each sentSet as sent, i}
        <div class="description-line">
            <span class="description-line-marker">{i+1}.</span> {sent}
        </div>
    {/each}
</div>

<div class="submission-input">
    
    {#each logStrSet as logStr, i}
        <div class="relative submission-input-line"> 
            <span class="description-line-marker mt2">{i+1}.</span> <LogStrInput bind:logStr={studentLogStrSet[i]}/>
        </div>
    {/each}
    
    {#each answersArr as implication, i}
        <div class="submission-input-line">
            <div class="dib v-mid">
                <select bind:value={implication[0]} >
                    {#each logStrSet as logStr, j}
                        <option value={(j+1)}>
                            {j+1}
                        </option>
                    {/each}
                </select>
                implies
                <select bind:value={implication[1]} >
                    {#each logStrSet as logStr, j}
                        <option value={(j+1)}>
                            {j+1}
                        </option>
                    {/each}
                </select>
            </div>
            <Button icon="close-outline" on:click={() => removeImplication(i)} />
        </div>
    {/each}
    <div class="lh-copy f6 mt3 ml4">
        <a on:click={addImplication}>+ Add implication</a>
    </div>
    
</div>