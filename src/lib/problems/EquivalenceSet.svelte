<script>
    import {validity} from '$lib/logic.js';
    import {dispLogStr} from '$lib/logic.js';

    export let id = '';
    export let logStr = '';
    export let logStrSet = '';

    let logStrSetArr = logStrSet.split(',');
    
    let selectedLogStrIndexes = [];

    $: correctLogStrIndexes = getCorrectLogStrIndexes(logStrSetArr);

    let submissionVerdict = '';
    let submissionMessage = '';

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
				submissionMessage = "Wrong. You've selected too many.";
                foundError = true;
            }
		}
		
		//check that they have all the equivalences
		for(var equiv1 of correctLogStrIndexes){
            if(!selectedLogStrIndexes.some((equiv2) => equiv1 == equiv2)){
				submissionMessage = "Wrong. You're missing some equivalences.";
                foundError = true;
            }
		}
		
        if(!foundError){
            submissionMessage = "Success!";
        }
    }

</script>
<li class="lh-copy pv3 bt b--black-10">
    <p>{id}. Determine which of the following schemata are equivalent to {dispLogStr(logStr)} :</p>
    <div class="pl3">
        {#each logStrSetArr as logStr, i}
            <label class="db">
                <input type=checkbox bind:group={selectedLogStrIndexes} value={i} />
                {dispLogStr(logStr)}
            </label>
        {/each}
    </div>
    <div class="problem-answer tc">
        <div class="tc ma4">
            <button class="f6 br1 ba ph3 pv2 mb2 dib black" on:click={checkSubmission}>Check</button>
            <p>{submissionMessage}</p>
        </div>
    </div>
</li>