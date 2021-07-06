<script>

	import {validity} from '$lib/logic.js';
    import {dispLogStr} from '$lib/logic.js';

    export let logStrSet = '';
    export let number = '';

    let logStrSetArr = logStrSet.split(',');

    let submissionVerdict = '';
    let submissionMessage = '';
    
    let answersArr = [[0,0]];
    // $: correctImpArr = getCorrectImpArr(logStrSet);
    let correctImpArr = getCorrectImpArr(logStrSetArr);

    function getCorrectImpArr(logStrSetArr){
        let correctArr = [];

        logStrSetArr.map(function(element, i, arr) {
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
	
		//Check that they don't have any self-implications
		for(var imp of answersArr){
			if(imp[0] == imp[1]){
				submissionMessage = "Please don't include self-implications (Ex. n implies n)";
                return;
            }
		}
	
		//check that they have no extraneous implications
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

<li class="lh-copy pv3 bt b--black-10">
    <p>{number}. Determine the implications that hold among the following set of schemata: <p/>
    <div class="pl3">
    {#each logStrSetArr as logStr, i}
        <div class="description_line">
            {i+1}. {dispLogStr(logStr)}
        </div>
    {/each}
    </div>

    <div class="problem-answer tc">
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
        <div on:click={addImplication}><a>+ Add implication</a></div>
        
        <div class="tc ma4">
            <button class="f6 br1 ba ph3 pv2 mb2 dib black" on:click={checkSubmission}>Check</button>
            <p>{submissionMessage}</p>
        </div>
    </div> 
</li>