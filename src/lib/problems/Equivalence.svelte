<script>

	import {tVal} from '$lib/logic.js';
	import {validity} from '$lib/logic.js';
	import {parseLogStr} from '$lib/logic.js';
	import {getLetterVars} from '$lib/logic.js';
    import {dispLogStr} from '$lib/logic.js';
    import TruthAssignmentInput from '$lib/components/TruthAssignmentInput.svelte';
    import HiddenTruthTable from '$lib/components/HiddenTruthTable.svelte';

    export let logStr1 = '';
    export let logStr2 = '';
    export let number = '';

    let letterVars = getLetterVars(logStr1+' <> '+logStr2);

	let submissionVerdict = '';
    let submissionMessage = '';

    function logSubmission(verdict, message) {
        // Store submission data somewhere???
        submissionVerdict = verdict;
        submissionMessage = message;
    }
	
	let answer = false;
	let interpretation = {};

    function checkSubmission() {

		if(!answer){
			
			//Evaluates if false on provided assignments
			if(!tVal(parseLogStr('('+logStr1+') <> ('+logStr2+')'), interpretation)){
				logSubmission('correct', "Correct");
                return;
			}
            else{
                logSubmission('incorrect', "Incorrect");
                return;
            }
		}
		else if(answer){
			//Evaluate validity of biconditional
			if(validity('('+logStr1+') <> ('+logStr2+')')){
				logSubmission('correct', "Correct");
			}
			else{
				logSubmission('incorrect', "Incorrect");
			}
		}
	}
	

</script>

<li class="lh-copy pv3 bt b--black-10">
	<p>{number}. Determine whether schema (1) and schema (2) are equivalent:</p>
    <div class="pl3">
        <p>1. {dispLogStr(logStr1)}<br/>
        2. {dispLogStr(logStr2)}</p>
    </div>
	
	<p>If equivalence fails to hold, provide an interpretation that witnesses this fact.</p>
	
    <div class="problem-answer tc">
        Equivalent? <input type=checkbox bind:checked={answer} />

        <HiddenTruthTable logStr={'[' + logStr1 + '] <> [' + logStr2 + ']'} />

        <div class="extra_question_wrapper">
            <div class="extra_question_message">If implication fails...</div>
            <TruthAssignmentInput bind:letterVars={letterVars} bind:interpretation />
        </div>

        <div class="tc ma4">
            <button class="f6 br1 ba ph3 pv2 mb2 dib black" on:click={checkSubmission}>Check</button>
            <p>{submissionMessage}</p>
        </div>
    </div>
</li>