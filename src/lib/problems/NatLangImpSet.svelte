<script>
    import LogStrInput from '$lib/components/LogStrInput.svelte';
    import ProblemWrapper from '$lib/components/ProblemWrapper.svelte';

    import {permutator, findChars} from '$lib/helpers.js';
	import {validity, getLetterVars} from '$lib/logic.js';
    
    export let number = '';
    export let sentSet = '';
    export let logStrSet = '';

    let sentSetArr = sentSet.split('/')
    let logStrSetArr = logStrSet.split(',');

    let submission;
    
    export let studentLogStrSet = [];
    export let answersArr = [[0,0]];
    //$: correctImpArr = getCorrectImpArr(logStrSet);
    let correctImpArr = getCorrectImpArr(logStrSetArr);

    function getCorrectImpArr(logStrSet){
        let correctArr = [];

        logStrSet.map(function(element, i, arr) {
            arr.forEach(function(el, j) {
                if(validity("("+arr[i]+') > ('+arr[j]+")") && arr[i] != arr[j]){
                    //var a = i; // i + 1, later, to correct for 0-index to 1-index
                    //var b = j; // j + 1, later, to correct for 0-index to 1-index
                    correctArr = [...correctArr, [i, j]];
                }
            });
        });
        return correctArr;
    }

    function addImplication(){
       answersArr = [...answersArr, [0,0]];
    }

    function removeImplication(i){
       answersArr.splice(i, 1);
       answersArr = answersArr;
    }

    function checkSubmission(){

        // Check the student paraphase of English sentences, abtracting away variable letter choice
        // Report which one is wrong if wrong
        for(var i = 0; i < logStrSetArr.length; i++){
            var correctStr = logStrSetArr[i];
            var studentStr = studentLogStrSet[i];
            var match = false;
        
            var correctVars = getLetterVars(correctStr);
            var studentVars = getLetterVars(studentStr);
            
            if(correctVars.length != studentVars.length){
                submission.log('warn', "Hmm...You don't seem to have the correct number of letters in your paraphrasing.");
                return;
            }
            
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
                    i = logStrSetArr.length;
                }
            }
            if(!match){
                submission.log('incorrect', "Paraphrase of "+ (i + 1) +" is incorrect.");
                return;
            }
        }
            
        //check if implications are right...

        //Check that they don't have any self-implications
		for(var imp of answersArr){
			if(imp[0] == imp[1]){
                submission.log('warn', "Please don't include self-implications (Ex. n implies n)");
                return;
            }
		}
	
		//Check that they have no extraneous implications
		for(var imp1 of answersArr){
			if(!correctImpArr.some((imp2) => imp1[0] == imp2[0] && imp1[1] == imp2[1])){
                submission.log('incorrect', "Some of your implications are wrong.");
                return;
            }
		}
		
		//check that they have all the implications
		for(var imp1 of correctImpArr){
            if(!answersArr.some((imp2) => imp1[0] == imp2[0] && imp1[1] == imp2[1])){
                submission.log('incorrect', "You're missing some implications.");
                return;
            }
		}
		
        submission.log('correct', 'Correct');
        return;
	}
	

</script>

<ProblemWrapper bind:submission on:click={checkSubmission} {number}>
    <div slot="description">
        <p>Paraphrase the following natural language sentences and then determine any implications that hold between them.</p>
        {#each sentSetArr as sent, i}
            <div class="description-line">
                <span class="description-line-marker">{i+1}.</span> {sent}
            </div>
        {/each}
    </div>
	
    <div slot="submission-input" class="tc">
        
        {#each logStrSetArr as logStr, i}
            <div class="relative">
                <span class="absolute left-1">{i+1}.</span> <LogStrInput bind:logStr={studentLogStrSet[i]}/>
            </div>
        {/each}

        {#each answersArr as implication, i}
            <button class="f6 br1 ba ph3 pv2 mb2 dib black" on:click={() => removeImplication(i)}>X</button>
            <select bind:value={implication[0]} >
                {#each logStrSetArr as logStr, j}
                    <option value={parseInt(j+1)}>
                        {j+1}
                    </option>
                {/each}
            </select>
            implies
            <select bind:value={implication[1]} >
                {#each logStrSetArr as logStr, j}
                    <option value={j+1}>
                        {j+1}
                    </option>
                {/each}
            </select>
            <br/>
        {/each}

        <button on:click={addImplication}>+ Add implication</button>
        
    </div>

</ProblemWrapper>