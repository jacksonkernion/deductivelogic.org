<script>

    import {validity} from '$lib/logic.js';
    import {dispLogStr} from '$lib/utils';
    import {connectives} from '$lib/stores';

    export let problem, submission;
    let logStr = problem.logStr;
    let logStrSet = problem.logStrSet;
    
    let selectedLogStrIndexes = [];

    //$: correctLogStrIndexes = getCorrectLogStrIndexes(logStrSet);
    let correctLogStrIndexes = getCorrectLogStrIndexes(logStrSet);

    function getCorrectLogStrIndexes(logStrSet){
        let correctArr = [];
        logStrSet.forEach(function(logStrItem, i) {
            if(validity("("+logStr+') <> ('+logStrItem+")")){
                correctArr = [...correctArr, i];
            }
        });
        return correctArr;
    }

    //read off 'checked' values from log str list, check them against answers
    submission.check = function(){

        var foundError = false;
	
		//check that they have no extraneous equivalences
		for(var equiv1 of selectedLogStrIndexes){
			if(!correctLogStrIndexes.some((equiv2) => equiv1 == equiv2)){
				this.log('incorrect', "Wrong. You've selected too many.");
                foundError = true;
            }
		}
		
		//check that they have all the equivalences
		for(var equiv1 of correctLogStrIndexes){
            if(!selectedLogStrIndexes.some((equiv2) => equiv1 == equiv2)){
				this.log('incorrect', "Wrong. You're missing some equivalences.");
                foundError = true;
            }
		}
		
        if(!foundError){
            this.log('correct');
        }
    }

</script>

<div class="lh-copy">
    <p>Determine which of the following schemata are equivalent to <span class="logStr">{dispLogStr(logStr, $connectives)}</span>:</p>     
</div>

<div class="submission-input">
    {#each logStrSet as logStr, i}
        <div class="submission-input-line">
            <label class="db">
                <input type=checkbox bind:group={selectedLogStrIndexes} value={i} />
                <span class="logStr">{dispLogStr(logStr, $connectives)}</span>
            </label>
        </div>
    {/each}    
</div>
