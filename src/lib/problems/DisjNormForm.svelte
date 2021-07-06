<script>
    import {tVal} from '$lib/logic.js';
	import {parseLogStr} from '$lib/logic.js';
	import {getLetterVars} from '$lib/logic.js';
	import {dispLogStr} from '$lib/logic.js';
	import LogStrInput from '$lib/components/LogStrInput.svelte';

    export let number;
    export let logStr;

    let studentLogStr = '';
	
	let submissionVerdict = '';
    let submissionMessage = '';

    function checkSubmission() {

        if(studentLogStr.indexOf('>') !== -1 || studentLogStr.indexOf('<>') !== -1){
			submissionMessage = 'Provided schema is not in disjunctive normal form.';
            return;
		}
		
		// Check to see if there are any disjunctions inside parentheses
		for(var i = 0; i < studentLogStr.length; i++){
			if(studentLogStr[i] == "(" || studentLogStr[i] == "[" || studentLogStr[i] == "{"){
			
				var parens = 1;
				
				for(var j=i+1; j<studentLogStr.length; j++) {
				
					if(studentLogStr[j] == "|"){
                        submissionMessage = 'You should not have a disjunction within parentheses.';
                        return;
                    }
					if(studentLogStr[j] == "(" || studentLogStr[j] == "[" || studentLogStr[j] == "{")
						parens++;
						
					if(studentLogStr[j] == ")" || studentLogStr[j] == "]" || studentLogStr[j] == "}")
						parens--;
						
					if(parens == 0){
						i = j;
                        j = studentLogStr.length; //break loop
					}
				}
			}
		}
			
		var studentLogStrs = studentLogStr.split('|');
		var studentArr = [];
		
		var letterVars = getLetterVars(logStr);
		
		for(var subLogStr of studentLogStrs){
			logProp = parseLogStr(subLogStr);
			if(!logProp){
				studentLogStrMessage = "Provided schema could not be understood.";
                return;
            }
            //as if for each row in a truth table...
            for(var i=0; i < Math.pow(letterVars.length, 2); i++){
                var assignments = {};
                //A left-padded binary string, representing the i-th row of truth table
                var truthValues = i.toString(2).padStart(letterVars.length, '0');
                for(var j=0; j < letterVars.length; j++){
                    if(truthValues[j] == 0)
                        assignments[letterVars[j]] = true;
                    else
                        assignments[letterVars[j]] = false;
                }
                if(tVal(logProp, assignments)){
                    studentArr.push(truthValues);
                }
            }
		
		}
		
		var correctArr = [];
		
		var logProp = parseLogStr(logStr);
		
		//as if for each row in a truth table
		for(var i=0; i < Math.pow(letterVars.length, 2); i++){
            var assignments = {};
            //A left-padded binary string, representing the i-th row of truth table
            var truthValues = i.toString(2).padStart(letterVars.length, '0');
			for(var j=0; j < letterVars.length; j++){
                if(truthValues[j] == 0)
                    assignments[letterVars[j]] = true;
                else
                    assignments[letterVars[j]] = false;
            }
			if(tVal(logProp, assignments)){
				correctArr.push(truthValues);
			}
		}
	
		//check that they have all the right assignments
		for(var t of correctArr){
			if(!studentArr.includes(t)){
				submissionMessage = "Incorrect";
                return;
			}
		}
		
		//check that they have no extraneous assignments
		for(var t of studentArr){
			if(!correctArr.includes(t)){
				submissionMessage = "Incorrect";
                return;
			}
		}
		submissionMessage = "Correct";
        return;
    }

</script>

<li class="lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30">
    <p>{number}. Transform the following schema into disjunctive normal form:</p>
    <div class="pl3">
		<p>{dispLogStr(logStr)}</p>
	</div>

    <LogStrInput bind:logStr={studentLogStr} />

    <div class="tc ma4">
        <button class="f6 br1 ba ph3 pv2 mb2 dib black" on:click={checkSubmission}>Check</button>
        <p>{submissionMessage}</p>
    </div>
</li>