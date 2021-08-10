import { permutator } from '$lib/helpers.js';

export function LogProp(logStr='') {
    this.symbol = null;
    this.parts = [];

    this.logStr = logStr;
    //Also add log str to parts array?

    /*
    function __clone(){
        if(is_array($this->parts)){
            $new_parts = array();
            foreach($this->parts as $part){
                $new_parts[] = clone $part;
            }
            $this->parts = $new_parts;
        }
    }
    */

}

export function tVal(logProp, tValues){
    //base case
    if(logProp.symbol === null){
        //return the value of this letter variable
        if(tValues[logProp.logStr] !== undefined){
            return tValues[logProp.logStr];
        }
        else
            return false;
        //if identity predicate, check if it's the same variable
        /* elseif(strpos($log_prop->parts, '!=') !== FALSE){
            if($log_prop->parts[2] != $log_prop->parts[3])
                return true;
        }
        elseif(strpos($log_prop->parts, '=') !== FALSE){
            if($log_prop->parts[1] == $log_prop->parts[2])
                return true;
        } */
        
    }
    //recursion
    else{
        
        let isA = (logProp.symbol[0]=='A');
        let isE = (logProp.symbol[0]=='E');
        if(isA || isE){

            //skip first parentheses
            var paren2pos = logProp.logStr.indexOf(')');
            var oldLogStr = logStrTrim(logProp.logStr.substr(paren2pos+1));
             
            for(var unit=1; unit<=tValues['domainSize']; unit++){
                var regex = new RegExp(logProp.symbol[1], 'g');
                var newLogStr = oldLogStr.replace(regex, unit);
                var newLogProp = parseLogStr(newLogStr);
                var val = tVal(newLogProp, tValues);
                if(!val && isA)
                    return false;
                else if(val && isE)
                    return true;
            }
            if(isA)
                return true;
            if(isE)
                return false;
        
        }
        else{
            switch(logProp.symbol){
                
                case "<>":
                    var p = tVal(logProp.parts[0], tValues);
                    var q = tVal(logProp.parts[1], tValues);
                    return (p && q) || (!p && !q);
                    break;
                    
                case ">":
                    var p = tVal(logProp.parts[0], tValues);
                    var q = tVal(logProp.parts[1], tValues);
                    return !p || q;
                    break;
                    
                case "|":
                    var response = false;
                    for(var part of logProp.parts){
                        if(tVal(part, tValues) == true){
                            response = true;
                            break;
                        }
                    }
                    return response;
                    break;
                    
                case ".":
                    var response = true;
                    var part;
                    for(part of logProp.parts){
                        if(tVal(part, tValues) == false){
                            response = false;
                            break;
                        }
                    }
                    return response;
                    break;
                    
                case "-":
                    return !tVal(logProp.parts[0], tValues);
                    break;
            }
        }
    }
}

export function isLower(character) {
    return (character === character.toLowerCase()) && (character !== character.toUpperCase());
}

export function getLetterVars(logStr) {

    let letterVars = [];
    let letter;
        
    //crawl the sentence string, look for lower case letters, store them
    for(let i=0; i<logStr.length; i++) {

        if(isLower(logStr[i])){
            letter = logStr[i];
            var match = false;
            letterVars.forEach(function(letterVar) {
                if(letter == letterVar){
                    match = true;
                }
            });	
            if(!match){
                letterVars.push(letter);
            }
        }
        //SEE logic.php for handling: identity, quant
    }
    
    //sort($letter_vars);
    return letterVars;
}

export function logStrTrim(logStr){
    logStr = logStr.trim();

    //This check to see if logStr is wrapped in parentheses, and gets rid of them
    if(logStr[0] == "(" && logStr[logStr.length-1] == ")" || logStr[0] == "[" && logStr[logStr.length-1] == "]" || logStr[0] == "{" && logStr[logStr.length-1] == "}"){
        
        let parens = 1;
        
        for(let j=1; j<logStr.length; j++) {
        
            if(logStr[j] == "(" || logStr[j] == "[" || logStr[j] == "{")
                parens++;
                
            if(logStr[j] == ")" || logStr[j] == "]" || logStr[j] == "}")
                parens--;
                
            if(parens == 0){
                if(j == (logStr.length-1)){
                    logStr = logStr.substring(1, logStr.length-1).trim();
                }
                return logStr;
            }
        }
    }
    
    return logStr;
}

export function parseLogStr(logStr){

    logStr = logStrTrim(logStr);

    let isQ = false;

    let logProp = new LogProp(logStr);

    // If logStr is *not* atomic...
    if(!logStr.match("/^[a-z0-9]+$/i")){
        //check string for syntactic chars
        let symbols = ['<>', '>', '|', '.', '-', 'A/E'];

        for(let n = 0; n < symbols.length; n++){

            let symbol = symbols[n];

            for(let i = 0; i < logStr.length; i++){

                //Skip over closed parentheses
                if((logStr[i] == "(" || logStr[i] == "[" || logStr[i] == "{") && symbol != 'A/E'){
                    
                    var parens = 1;
                    for(let j=i+1; j<logStr.length; j++) {
                    
                        if(logStr[j] == "(" || logStr[j] == "[" || logStr[j] == "{")
                            parens++;
                            
                        if(logStr[j] == ")" || logStr[j] == "]" || logStr[j] == "}")
                            parens--;
                    
                        if(parens == 0){
                            i = j;
                            break;
                        }
                    }
                }
                else if(symbol == 'A/E' && (logStr[i] == 'A' || logStr[i] == 'E')){
                    logProp.symbol = logStr.substr(i, 2);
                    if(logStr[i+2] == ')' || logStr[i+2] == ']' || logStr[i+2] == '}')
                        var part = logStrTrim(logStr.substr(i+3));
                    else
                        var part = logStrTrim(logStr.substr(i+2));
                    logProp.parts = [parseLogStr(part)];
                    
                    if(!logProp.parts[0])
                            return false;
                    return logProp;
                }
                else if(symbol == "<>"){
                    if(logStr[i] == "<" && logStr[i+1] == ">"){
                        
                        logProp.symbol = symbol;
                        logProp.parts = [parseLogStr(logStrTrim(logStr.substring(0, i))), parseLogStr(logStrTrim(logStr.substring(i+2)))];
                        
                        logProp.parts.forEach(part => {
                            if(!part)
                                return FALSE;
                        })
                        n = symbols.length;
                        return logProp;
                        break;
                    }
                }
                else if(symbol == logStr[i]){
                    logProp.symbol = symbol;

                    switch(symbol) {

                        case ">":
                            logProp.parts = [parseLogStr(logStrTrim(logStr.substring(0, i))), parseLogStr(logStrTrim(logStr.substring(i+1)))];
                            break;
                            
                        case "|":
                            logProp.parts = [parseLogStr(logStrTrim(logStr.substring(0, i)))];
                            var logPropSub = parseLogStr(logStr.substring(i+1));
                            if(logPropSub.symbol == '|'){
                                logProp.parts = logProp.parts.concat(logPropSub.parts);
                            }
                            else{
                                logProp.parts.push(parseLogStr(logStrTrim(logStr.substring(i+1))));
                            }
                            break;

                        case '.':
                            logProp.parts = [parseLogStr(logStrTrim(logStr.substring(0, i)))];
                            var logPropSub = parseLogStr(logStrTrim(logStr.substring(i+1)));
                            if(logPropSub.symbol == '.'){
                                // add parts to parts array...
                                logProp.parts = logProp.parts.concat(logPropSub.parts);
                            }
                            else{
                                logProp.parts.push(logPropSub);
                            }
                            break;

                        case "-":
                            //Make sure this isn't in between a quatificational statement
                            if(isQ){
                                //Make sure there's no E or A behind negation
                                for(let j=0; j<i; j++){
                                    if(logStr[j] == 'A' || logStr[j] == 'E')
                                        return false;
                                }
                            }
                            logProp.parts = [parseLogStr(logStrTrim(logStr.substring(i+1)))];
                            break;
                    }
                    n = symbols.length;
                    return logProp;
                    break;
                    
                }
            }

        }
            
        // Check if parts exist..if not return false? (See old script...)

    }

    logProp.parts.forEach(part =>{
        if(!part)
            return false;
    }) 

    //console.log("End: "+logStr);
    //console.log(logProp);
    return logProp;
}

export function validity(logStr){

    var isQ = false;

    // see logic.php for handling quant schema...
    var letterVars = getLetterVars(logStr);
    
    var logProp = parseLogStr(logStr);

    //as if for each row in a truth table...
    for(let i=0; i < Math.pow(2, letterVars.length); i++){
        let assignments = {};
        //A left-padded binary string, representing the i-th row of truth table
        let truthValues = i.toString(2).padStart(letterVars.length, '0');
        for(let j=0; j < letterVars.length; j++){
            if(truthValues[j] == 0)
                assignments[letterVars[j]] = true;
            else
                assignments[letterVars[j]] = false;
        }
        //if(isQ)
            //assignments['domain_size'] = self::get_domain_size($logStr);
        if(!tVal(logProp, assignments)){
            return false; 
        }
    }
    return true;
}

export function dispLogStr(logStr){
    for(var i=0; i < logStr.length; i++){
        if(logStr[i] == "<" && logStr[i+1] == ">")
            logStr = logStr.substring(0, i) + "≡" + logStr.substring(i+2);
        else if(logStr[i] == ">")
            logStr = logStr.substring(0, i) + "⊃" + logStr.substring(i+1);
        else if(logStr[i] == "|")
            logStr = logStr.substring(0, i) + "∨" + logStr.substring(i+1);
        //else if($logStr[$i] == ".")
            //$logStr = substr($logStr, 0, $i) . "·" . substr($logStr, $i+1);
        else if(logStr[i] == "-")
            logStr = logStr.substring(0, i) + "–" + logStr.substring(i+1);
        else if(logStr[i] == "A")
            logStr = logStr.substring(0, i) + "∀" + logStr.substring(i+1);
        else if(logStr[i] == "E")
            logStr = logStr.substring(0, i) + "∃" + logStr.substring(i+1);
    }

    return logStr;
}

export function isQ(logStr){
	var isQ = false;
	if(logStr.indexOf('A') !== -1 || logStr.indexOf('E') !== -1)
		isQ = true;
	return isQ;
}

export function findNonQuantLogProp(logProp){

	if(logProp.symbol.indexOf('A') !== -1 || logProp.symbol.indexOf('E') !== -1){
		return findNonQuantLogProp(logProp.parts[0]);
	}
	else
		return logProp;

}

export function getQuantArray(logProp, obj = null){

	if(obj === null){
		var obj = {A: [], E: []};
	}

	if(logProp.symbol.indexOf('A') !== -1){
		obj.A.push(logProp.symbol);
		return getQuantArray(logProp.parts[0], obj);
	}
	else if(logProp.symbol.indexOf('E') !== -1){
		obj.E.push(logProp.symbol);
		return getQuantArray(logProp.parts[0], obj);
	}
	else
		return obj;

}

export function replaceVar(oldVar, newVar, logProp){

    // Need a 'deep clone' so that I don't accidentally affect the evaluation of the logProp elsewhere, by replacing the var permanently
	var clonedLogProp = JSON.parse(JSON.stringify(logProp));
	
	//base case
	if(!clonedLogProp.symbol){
	
        var regex = new RegExp(oldVar, 'g');
		clonedLogProp.logStr.replace(regex, newVar);
		return clonedLogProp;
		
	}
	else{
        
		for(var key=0; key < clonedLogProp.parts.length; key++){
		
            clonedLogProp.parts[key] = replaceVar(oldVar, newVar, clonedLogProp.parts[key]);
		
		}
		
		return clonedLogProp;
	
	}

}

export function propToStr(logProp){

	if(logProp.symbol === null)
		return logProp.parts;
	
	else{
	
		var logStr = '';
		
		if(logProp.symbol.indexOf('A') !== -1 || logProp.symbol.indexOf('E') !== -1){
		
			logStr = '('+logProp.symbol+')('+propToStr(logProp.parts[0])+')';
		
		}
		else if(logProp.symbol === '-'){
		
			logStr = '-('+propToStr(logProp.parts[0])+')';
		
		}
		else{
		
			logStr += '[';	
		
			for(const [key, logPropPart] of logProp.parts){
				
				logStr += propToStr(logPropPart);
				
				if(key !== (logProp.parts.length - 1)){
				
					logStr += ' ' + logProp.symbol + ' ';
				
				}
			
			}
			
			logStr += ']';
		
		}
		
		return logStr;
	
	}

}

export function prenexForm(logProp, unusedVariables=null){
    
	
	//base case
	if(logProp.symbol === null){
		return logProp;
	}
	
	//Get prenex form
	else{
	
		//if unusedVariables isn't set, create an array with all lowercase letters
		if(!unusedVariables){
			
			var unusedVariables = [];
			for(var i=97; i<123; i++){
				//Make sure they aren't already used in the prop, lest it lead to confusion, mixups
				if(logProp.logStr.indexOf(String.fromCharCode(i)) === -1){
					unusedVariables.push(String.fromCharCode(i));
				}
			}
			
		}
		
		//There's a special case for biconditionals...
		if(logProp.symbol === "<>" ){
		
			//We just need to change around the logProp that we should be looking to prenex. We should not be calling log prenex
			// on any of the parts, because prenex will be called on the parts when its later run through
			var newLogProp = {symbol: "|"};
			
			let newLogPropPart1 = new LogProp();
			newLogPropPart1.symbol = ".";
			for(logPropPart in logProp.parts){
                //clone logProp part
				newLogPropPart1.parts.push(JSON.parse(JSON.stringify(logPropPart)));
			}
			
            //clone logProp part
			let newLogPropPart2 = JSON.parse(JSON.stringify(newLogPropPart1));
			for(const [key, logPropPart]of newLogPropPart2.parts){
				let reallyNewLogProp = new LogProp();
				reallyNewLogProp.symbol = "-";
				reallyNewLogProp.parts = [logPropPart];
				newLogPropPart2.parts[key] = reallyNewLogProp;
			}
		
			newLogProp.parts = [newLogPropPart1, newLogPropPart2];
			newLogProp = prenexForm(newLogProp, unusedVariables);
		}
		else{
			//Law of distribution - reaches a common ground
			if(logProp.symbol === "." || logProp.symbol === "|"){
			
				if(logProp.symbol === "."){
					var testSymbol = "A";
					var oldSymbol = ".";
				}
				else{
					var testSymbol = "E";
					var oldSymbol = "|";
				}
					
				var allEOrAllA = true;
				for(var i=0; i < logProp.parts.length; i++){
                    if(!logProp.parts[i].symbol){
                        allEOrAllA = false;
						i = logProp.parts.length;
                    }
					else if(logProp.parts[i].symbol.indexOf(testSymbol) === -1){
						allEOrAllA = false;
						i = logProp.parts.length;
					}
				}
				if(allEOrAllA){
					logProp.symbol = logProp.parts[0].symbol;
					
					//replace all other related vars with new big var on campus
					for(const [key, logPropPart] of logProp.parts){
						if(key !== 0)
							replaceVar(logPropPart.symbol[1], logProp.symbol[1], logPropPart);
						logProp.parts[key] = logProp.parts[key].parts[0];
					}
                    // clone logProp
                    newLogProp1 = JSON.parse(JSON.stringify(logProp));
					newLogProp1.symbol = oldSymbol;
					logProp.parts = [newLogProp1];
					return prenexForm(logProp, unusedVariables);
				}
		
			}
			
			for(var i=0; i< logProp.parts.length; i++){
				logProp.parts[i] = prenexForm(logProp.parts[i], unusedVariables);
			}
		
			var newLogProp = new LogProp();
			
			//If the old log prop symbol is E or A, we don't want to be switching around symbol order
			if(logProp.symbol.indexOf('A') !== -1 || logProp.symbol.indexOf('E') !== -1){
				
				//but we do want to assign it a new variable, to ensure correct scope
				newLogProp.symbol =  logProp.symbol[0] + unusedVariables[unusedVariables.length - 1];
				newLogProp.parts.push(replaceVar(logProp.symbol[1], unusedVariables[unusedVariables.length - 1], logProp.parts[0]));
				unusedVariables.splice(unusedVariables.length - 1);
				
			}
			// Else, we might need to switch the symbol order
			else{
				newLogProp = pullOutQ(logProp);
			}
		
		}
		return newLogProp;
		
	}

}

export function pullOutQ(logProp){
	
    //base case
	if(logProp.symbol === null)
		return logProp;
    
    //recursion
	else{
	
        // clone logProp
		let newLogProp = JSON.parse(JSON.stringify(logProp));
	
		//Go through each part, and see if any of them have and E or A symbol
		for(var key=0; key<logProp.parts.length; key++){
            
            var logPropPart = logProp.parts[key];

			// If E or A 
			if(logProp.symbol.indexOf('A') !== -1 || logProp.symbol.indexOf('E') !== -1){
				
                newLogProp.symbol = logPropPart.symbol;

				//If original symbol was negation or if antecedent of conditional, we need to switch quant symbols
				if(logProp.symbol === "-" || (logProp.symbol === ">" && key === 0)){
					if(logProp.symbol.indexOf('A') !== -1){
						newLogProp.symbol[0] = "E";
					}
					else
                        newLogProp.symbol[0] = "A";
				}
				
				//Switch the around the order of stuff
				let reallyNewLogProp = new LogProp();
				reallyNewLogProp.parts = logProp.parts;
				reallyNewLogProp.parts[key] = logProp.parts[key].parts[0];
				reallyNewLogProp.symbol = logProp.symbol;
				newLogProp.parts = pullOutQ(reallyNewLogProp);
				newLogProp.logStr = null;
				//break loop
                key = logProp.parts.length;
				
			}
		
		}
		
		return newLogProp;
	
	}

}

export function quantEquiv(logProp1, logProp2, letterVars){
	
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
        if(tVal(logProp1, assignments) != tVal(logProp2, assignments)){
            return false; 
        }
	}
	return true;

}

export function quantParaphrase(logStr1, logStr2) {

	/**************
	KNOWN BUG - There's a risk of using replacement variables that exist elsewhere in the log_prop that
	has var_replacement done to it.
	
	Ex. (Ax)(Fxy) is counted as a paraphrase of (Ay)(Fyy).
	
	
	*I'm not addressing this now because this will only occur if using free variables, variables not 
	constrained by some quantifier. For right now, every variable belonging to a quantifier WILL be replaced.
	
	*An easy fix would just be to compare lowercase letter vars at the outset.
		- in example, 2 letter vars (x,y) would not match one letter var (y).
	
	***************/

	let logProp1 = prenexForm(parseLogStr(logStr1));
	let logProp2 = prenexForm(parseLogStr(logStr2));

	let nonQLogProp1 = findNonQLogProp(logProp1);
	let nonQLogProp2 = findNonQLogProp(logProp2);

	//Get arrays of As and Es
	let quantArr1 = getQuantArray(logProp1);
	let quantArr2 = getQuantArray(logProp2);
	
	if(quantArr1['A'].length != quantArr2['A'].length || quantArr1['E'].length != quantArr2['E'].length){
		return false;
	}
	
	//Get permutations for matching 1 to 1 quant
	let Aperms = permutator(quantArr1['A']);
	let Eperms = permutator(quantArr1['E']);

	for(var Aperm in Aperms){
	
		for(var Eperm in Eperms){
		
            // clone logProp
			var testLogProp = JSON.parse(JSON.stringify(nonQlogProp2));
			
			//replace all the letter vars attached to A with potentially matching vars in lopProp1
			//do it once, to mark the spots with the key (because it could kludge vars)
			for(const [key, quantA] of Aperm){

				testLogProp = replaceVar(quantArr2['A'][key][1], key, testLogProp);
			
			}
			//do it again to get letters in
			for(const [key, quantA] of Aperm){
			
				testLogProp = replaceVar(key, quantA[1], testLogProp);
			
			}
			
			//do it once, to mark the spots with the key (because it could kludge vars)
			for(const [key, quantE] of Eperm){
		
				testLogProp = replaceVar(quantArr2['E'][key][1], key, testLogProp);
			
			}
			//do it again to get letters in
			for(const [key, quantE] of Eperm){
			
				testLogProp = replaceVar(key, quantE[1], testLogProp);
				
			}
			
			//test equivalence of two nonQ log props over all rows of tTable	
			let letterVars = getLetterVars(propToStr(nonQLogProp1));
			if(quantEquiv(nonQLogProp1, testLogProp, letterVars)){
				return true;
			}
		}
	}
	return false;
}