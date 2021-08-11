<script>
    import ProblemWrapper from '$lib/components/ProblemWrapper.svelte';

    import {validity} from '$lib/logic.js';
    import {dispLogStr} from '$lib/helpers.js';

    export let number = '';
    export let logStr = '';
    export let logStrSet = '';

    let logStrSetArr = logStrSet.split(',');
    
    let selectedLogStrIndexes = [];

    $: correctLogStrIndexes = getCorrectLogStrIndexes(logStrSetArr);

    let submission;

    function getCorrectLogStrIndexes(logStrSetArr){
        let correctArr = [];
        logStrSetArr.forEach(function(logStrItem, i) {
            if(validity("("+logStr+') <> ('+logStrItem+")")){
                correctArr = [...correctArr, i];
            }
        });
        return correctArr;
    }

    //read off 'checked' values from log str list, check them against answers
    function checkSubmission(){

        var foundError = false;
	
		//check that they have no extraneous equivalences
		for(var equiv1 of selectedLogStrIndexes){
			if(!correctLogStrIndexes.some((equiv2) => equiv1 == equiv2)){
				submission.log('incorrect', "Wrong. You've selected too many.");
                foundError = true;
            }
		}
		
		//check that they have all the equivalences
		for(var equiv1 of correctLogStrIndexes){
            if(!selectedLogStrIndexes.some((equiv2) => equiv1 == equiv2)){
				submission.log('incorrect', "Wrong. You're missing some equivalences.");
                foundError = true;
            }
		}
		
        if(!foundError){
            submission.log('correct', "Correct");
        }
    }

</script>

<ProblemWrapper bind:submission on:click={checkSubmission} {number}>
    <div slot="description">
        <p>Determine which of the following schemata are equivalent to {dispLogStr(logStr)}:</p>     
    </div>
	
    <div slot="submission-input">

        {#each logStrSetArr as logStr, i}
            <label class="db">
                <input type=checkbox bind:group={selectedLogStrIndexes} value={i} />
                {dispLogStr(logStr)}
            </label>
        {/each}    
    </div>

</ProblemWrapper>