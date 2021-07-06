<script>

	import {tVal} from '$lib/logic.js';
	import {validity} from '$lib/logic.js';
	import {parseLogStr} from '$lib/logic.js';
	import {getLetterVars} from '$lib/logic.js';
    import {dispLogStr} from '$lib/logic.js';
    import TruthAssignmentInput from '$lib/components/TruthAssignmentInput.svelte';
    import HiddenTruthTable from '$lib/components/HiddenTruthTable.svelte';

    /*function removeDuplicates(array) {
        return array.filter((a, b) => array.indexOf(a) === b)
    };*/

    export let logStr1 = '';
    export let logStr2 = '';
    export let number = '';

    let isQ = false;

	let tTableData = {
        logStr: logStr1+' > '+logStr2,
        logSubStrs: [],
        letterVars: getLetterVars(logStr1+' > '+logStr2),

        tAssignmentRows: [],
        tAnswerRows: [],
    };

	let submission = '';
	let submissionStatus = '';
	let submissionMessage = '';
	
	let answer = false;
	let interpretation = {};

    function checkSubmission() {

		if(!answer){
			
			//Evaluates if false on provided assignments
			if(!tVal(parseLogStr('('+logStr1+') > ('+logStr2+')'), interpretation)){
				submissionMessage = "Correct";
                return;
			}
            else{
                submissionMessage = "Incorrect";
                return;
            }
		}
		else if(answer){
			//Evaluate validity of conditional
			if(validity('('+logStr1+') > ('+logStr2+')')){
				submissionMessage = "Correct";
                return;
			}
			else{
				submissionMessage = 'Incorrect';
                return
			}
		}
	}
	

</script>

<style>
</style>

<li class="lh-copy pv3 bt b--black-10">
	<p>{number}. Does schema (1) imply schema (1)?</p>
	<div class="pl3">
        <p>1. {dispLogStr(logStr1)}<br/>
        2. {dispLogStr(logStr2)}</p>
    </div>
	
	<p> If implication fails to hold, provide an interpretation that witnesses this fact. </p>
	
    <div class="problem-answer tc">
        Implies? <input type=checkbox bind:checked={answer} /> 

        <div class="problem-answer">
            
            {#if !isQ}
                <HiddenTruthTable logStr={logStr1+' <> '+logStr2} />   
            {/if}

            <div class="extra_question_wrapper">
                <div class="extra_question_message">If implication fails...</div>
                <TruthAssignmentInput bind:letterVars={tTableData.letterVars} bind:interpretation />
            </div>
        </div>

        <div class="tc ma4">
            <button class="f6 br1 ba ph3 pv2 mb2 dib black" on:click={checkSubmission}>Check</button>
            <p>{submissionMessage}</p>
        </div>
    </div>
</li>