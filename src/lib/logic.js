export function LogProp(logStr) {
    this.symbol = null;
    this.parts = [];
    this.logStr = '';

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
    if(logProp.symbol == null){
        //return the value of this letter variable
        if(typeof tValues[logProp.logStr] != undefined){
            //console.log(logProp.logStr+': '+tValues[logProp.logStr]);
            return tValues[logProp.logStr];
        }
        //if identity predicate, check if it's the same variable
        /* elseif(strpos($log_prop->parts, '!=') !== FALSE){
            if($log_prop->parts[2] != $log_prop->parts[3])
                return true;
        }
        elseif(strpos($log_prop->parts, '=') !== FALSE){
            if($log_prop->parts[1] == $log_prop->parts[2])
                return true;
        } */
        else
            return false;
    }
    //recursion
    else{
        
        let isA = (logProp.symbol[0]=='A');
        let isE = (logProp.symbol[0]=='E');
        if(isA || isE){
             /*
            for($unit=1; $unit<=$t_values['domain_size']; $unit++){
                //skip first parentheses
                //$log_prop->logStr = self::logStr_trim($log_prop->logStr);
                $paren2pos = strpos($log_prop->logStr, ')');
                $old_logStr = self::logStr_trim(substr($log_prop->logStr, $paren2pos+1));
                $new_logStr = str_replace($log_prop->symbol[1], $unit, $old_logStr);
                $new_log_prop = self::parse_logStr($new_logStr);
                $t_val = self::t_val($new_log_prop, $t_values);
                if(!$t_val && $isA)
                    return FALSE;
                elseif($t_val && $isE)
                    return TRUE;
            }
            if($isA)
                return TRUE;
            if($isE)
                return FALSE;
            */
            /*
            foreach($t_values['predicates'] as $pred){
                $pred = explode('/', $pred);
                $F = $pred[0];
                $n = $pred[1];
                $vars = $this->var_str_perms($t_values['domain'], $n);
                foreach($vars as $var){
                    if($t_values[$F.$var]){
                    
                    }
                }
            } */
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
        //array of syntactic chars..
        let symbols = ['<>', '>', '|', '.', '-'];

        for(let n = 0; n < symbols.length; n++){

            let symbol = symbols[n];

            //console.log(symbol);

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
                else if(symbol == "<>"){
                    if(logStr[i] == "<" && logStr[i+1] == ">"){
                        
                        logProp.symbol = symbol;
                        logProp.logStr = logStr;
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
