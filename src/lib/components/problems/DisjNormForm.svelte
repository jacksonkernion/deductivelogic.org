<script>

	import LogStrInput from '$lib/components/problems/sub-components/LogStrInput.svelte';

    import {tVal, parseLogStr, getLetterVars} from '$lib/logic.js';
	import {dispLogStr} from '$lib/utils';
	import {connectives} from '$lib/stores';

	export let problem;
	export let submission;

    let studentLogStr = '';

    submission.check = function() {

        if(studentLogStr.indexOf('>') !== -1 || studentLogStr.indexOf('<>') !== -1){
			this.log('warn', 'Provided schema is not in disjunctive normal form.');
            return;
		}
		
		// Check to see if there are any disjunctions inside parentheses
		for(var i = 0; i < studentLogStr.length; i++){
			if(studentLogStr[i] == "(" || studentLogStr[i] == "[" || studentLogStr[i] == "{"){
			
				var parens = 1;
				
				for(var j=i+1; j<studentLogStr.length; j++) {
				
					if(studentLogStr[j] == "|"){
                        this.log('warn', 'You should not have a disjunction within parentheses.');
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
		
		var letterVars = getLetterVars(problem.logStr);
		
		for(var subLogStr of studentLogStrs){
			logProp = parseLogStr(subLogStr);
			if(!logProp){
				studentLogStrMessage = "Provided schema could not be understood.";
                return;
            }
            //as if for each row in a truth table...
            for(var i=0; i < Math.pow(2,letterVars.length); i++){
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
		
		var logProp = parseLogStr(problem.logStr);
		
		//as if for each row in a truth table
		for(var i=0; i < Math.pow(2, letterVars.length); i++){
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
				this.log('incorrect', "Incorrect");
                return;
			}
		}
		
		//check that they have no extraneous assignments
		for(var t of studentArr){
			if(!correctArr.includes(t)){
				this.log('incorrect', "Incorrect");
                return;
			}
		}
		this.log('correct');
        return;
    }

</script>

<div class="lh-copy">
	<p>Transform the following schema into disjunctive normal form:</p>
	<div class="description-line logStr">{dispLogStr(problem.logStr, $connectives)}</div>
</div>

<div class="submission-input">
	<div class="submission-input-line">
		<LogStrInput bind:logStr={studentLogStr} />
	</div>
</div>
