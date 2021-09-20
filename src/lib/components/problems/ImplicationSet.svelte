<script>
    import ProblemWrapper from '$lib/components/problems/sub-components/ProblemWrapper.svelte';
    import Button from '$lib/components/atoms/Button.svelte';

    import {validity} from '$lib/logic.js';
    import {dispLogStr} from '$lib/utils';
    import {connectives} from '$lib/stores';

    export let problem, number, isAdmin;
    let logStrSet = problem.logStrSet;

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

<ProblemWrapper bind:submission on:click={checkSubmission} {problem} {number} {isAdmin}>
    <div slot="description">
        <p>Determine the implications that hold among the following set of schemata:</p>
        {#each logStrSet as logStr, i}
            <div class="description-line">
                <span class="description-line-marker">{i+1}.</span> <span class="logStr">{dispLogStr(logStr, $connectives)}</span>
            </div>
        {/each}
    </div>
	
    <div slot="submission-input">

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

</ProblemWrapper>