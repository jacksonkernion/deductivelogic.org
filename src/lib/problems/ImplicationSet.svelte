<script>
    import ProblemWrapper from '$lib/components/ProblemWrapper.svelte';

    import {validity} from '$lib/logic.js';
    import {dispLogStr} from '$lib/helpers.js';

    export let number = '';
    export let logStrSet = [];

    let submission;
    
    let answersArr = [[1,1]];
     $: correctImpArr = getCorrectImpArr(logStrSet);
    // let correctImpArr = getCorrectImpArr(logStrSet);

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

    function checkSubmission(){
	
		//Check that they don't have any self-implications, duplicates
		for(var i in answersArr){
            var imp = answersArr[i];
			if(imp[0] == imp[1]){
				submission.log('warn', "Please don't include self-implications (Ex. n implies n)");
                return;
            }
            for(var j in answersArr){
                if(j != i){
                    if(imp[0] == answersArr[j][0] && imp[1] == answersArr[j][1]){
                        submission.log('warn', "Remove duplicate: '("+imp[0]+') implies ('+imp[1]+")'");
                        return;
                    }
                }
            }
		}
	
		//check that they have no extraneous implications
		for(var imp1 of answersArr){
			if(!correctImpArr.some((imp2) => imp1[0] == imp2[0] && imp1[1] == imp2[1])){
                console.log(imp1);
                console.log(correctImpArr);
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
        <p>Determine the implications that hold among the following set of schemata:</p>
        {#each logStrSet as logStr, i}
            <div class="description-line">
                <span class="description-line-marker">{i+1}.</span> {dispLogStr(logStr)}
            </div>
        {/each}
    </div>
	
    <div slot="submission-input" class="tc">

        {#each answersArr as implication, i}
            <button class="f6 br1 ba ph3 pv2 mb2 dib black" on:click={() => removeImplication(i)}>X</button>
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
            <br/>
        {/each}

        <button class="f6 br1 ba ph3 pv2 mb2 dib black" on:click={addImplication}>+ Add implication</button>
        
    </div>

</ProblemWrapper>