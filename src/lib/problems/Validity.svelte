<script>
    import {dispLogStr} from '$lib/logic.js';
    import {tVal} from '$lib/logic.js';
	import {validity} from '$lib/logic.js';
	import {parseLogStr} from '$lib/logic.js';
	import {getLetterVars} from '$lib/logic.js';
    import TruthAssignmentInput from '$lib/components/TruthAssignmentInput.svelte';

    export let logStr = '';
    export let number = '';

	export let tTableData = {
        logStr: logStr,
        logSubStrs: [],
        letterVars: getLetterVars(logStr),

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
            submissionMessage = 'Truth assignment input not yet functioning properly...';
            
            //Evaluates if false on provided assignments
            if(!tVal(parseLogStr(logStr), interpretation)){
                submissionMessage = "Correct";
                return;
            }
            else{
                submissionMessage = "Incorrect";
                return;
            }
        }
        else if(answer){
            //Evaluate validity
            if(validity(logStr)){
                submissionMessage = 'Correct';
                return;
            }
            else{
                submissionMessage = 'Incorrect';
                return;
            }
        }
    }

</script>


<li class="lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30">
    <p>Test the following schema for validity: <br/><br/> {dispLogStr(logStr)} </p>
    <p>If not valid, provide an interpretation under which the schema is false.</p>

    Valid? <input type=checkbox bind:checked={answer} />

    <div class="extra_question_wrapper">
		<div class="extra_question_message">If not valid...</div>
		<TruthAssignmentInput bind:letterVars={tTableData.letterVars} bind:interpretation />
	</div>

    <p>Submission Status: {submissionMessage}</p>   
    <button class="f6 link dim br2 ph3 pv2 mb2 dib white bg-black" on:click={checkSubmission}>Check</button>
</li>