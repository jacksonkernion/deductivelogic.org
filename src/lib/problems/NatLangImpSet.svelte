<script>

    import { permutator } from '$lib/helpers.js';
	import {validity} from '$lib/logic.js';
    import {getLetterVars} from '$lib/logic.js';
    import LogStrInput from '$lib/components/LogStrInput.svelte';

    export let number = '';
    export let sentSet = '';
    export let logStrSet = '';

    let sentSetArr = sentSet.split('/')
    let logStrSetArr = logStrSet.split(',');

    export let submissionStatus = '';
    export let submission = '';
	export let submissionMessage = '';
    
    export let studentLogStrSet = [];
    export let answersArr = [[0,0]];
    //$: correctImpArr = getCorrectImpArr(logStrSet);
    let correctImpArr = getCorrectImpArr(logStrSetArr);

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
                submissionMessage = "Hmm...You don't seem to have the correct number of letters in your paraphrasing.";
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
                submissionMessage = "Wrong. Your paraphrase of ("+ (i + 1) + ") looks wrong.";
                return;
            }
        }
            
        //check if implications are right...

        //Check that they don't have any self-implications
		for(var imp of answersArr){
			if(imp[0] == imp[1]){
				submissionMessage = "Please don't include self-implications (Ex. n implies n)";
                return;
            }
		}
	
		//Check that they have no extraneous implications
		for(var imp1 of answersArr){
			if(!correctImpArr.some((imp2) => imp1[0] == imp2[0] && imp1[1] == imp2[1])){
				submissionMessage = "Some of your implications are wrong.";
                return;
            }
		}
		
		//check that they have all the implications
		for(var imp1 of correctImpArr){
            if(!answersArr.some((imp2) => imp1[0] == imp2[0] && imp1[1] == imp2[1])){
				submissionMessage = "You're missing some implications.";
                return;
            }
		}
		
        submissionMessage = "Success!";
        return;
	}
	

</script>

<li class="lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30">
    <div class="problem-description">{number}. Paraphrase the following natural language sentences and then determine any implications that hold between them. <br/>
        {#each logStrSetArr as logStr, i}
            <div class="description_line">
                {i+1}. {logStr}
            </div>
        {/each}
    </div>

    <div class="problem-answer">
        {#each sentSetArr as sent, i}
            <div>
                {i+1}. <LogStrInput bind:logStr={studentLogStrSet[i]}/>
            </div>
        {/each}

        {#each answersArr as implication, i}
            <button on:click={() => removeImplication(i)}>X</button>
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
        <div on:click={addImplication}><a>+ Add implication</a></div>
        
        <p>Submission Status: {submissionMessage}</p>   
        <button class="f6 link dim br2 ph3 pv2 mb2 dib white bg-black" on:click={checkSubmission}>Check</button>
    </div> 
</li>