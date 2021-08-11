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

export function unfancyLogStr(str){
	var fixed = str;
	//regex = new RegExp(biconditional.symbol, "g");
    var regex = new RegExp('≡', "g");
	fixed= fixed.replace(regex, "<>");
	//regex = new RegExp(conditional.symbol, "g");
    regex = new RegExp('⊃', "g");
	fixed = fixed.replace(regex, ">"); 
	fixed = fixed.replace(/\u2200/g, "A");
	fixed = fixed.replace(/\u2203/g, "E");
	//regex = new RegExp(or.symbol, "g");
    regex = new RegExp('∨', "g");
	fixed = fixed.replace(regex, "|");
	//regex = new RegExp(not.symbol, "g");
    regex = new RegExp('–', "g");
	fixed = fixed.replace(regex, "-");
	/* if(and.symbol != '.'){
        regex = new RegExp(and.symbol, "g");
		fixed = fixed.replace(regex, ".");
	} */
	fixed= fixed.replace(/≠/g,"!=");
	return fixed;
}

function factorial(int){
	if(int < 2) {
		return 1;
	}

	for(f = 2; (int-1) > 1; f *= $int--);

	return f;
}

function perm(arr, nth = null) {
	
	if (nth === null) {
		return permutator(arr);
	}

	var result = [];
	var length = arr.length;

	while (length--) {
			var f = factorial(length);
			var p = Math.floor(nth / f);
			result.push(arr[p]);
			arr.splice(p, 1);
			nth -= p * f;
	}

	result = result.concat(arr);
	return result;
}
	
export function permutator(arr) {
	var p = [];
	for (var i=0; i < factorial(arr.length); i++) {
		p.push(perm(arr, i));
	}
	return p;
}

/* Some permutation function I found online, to replace permutation fuction form PHP. But behaves slightly differently, so had to update
export function permutator(inputArr) {
	var results = [];

	function permute(arr, memo) {
		var cur, memo = memo || [];

		for (var i = 0; i < arr.length; i++) {
		cur = arr.splice(i, 1);
		if (arr.length === 0) {
			results.push(memo.concat(cur));
		}
		permute(arr.slice(), memo.concat(cur));
		arr.splice(i, 0, cur[0]);
		}

		return results;
	}

	return permute(inputArr);
}
*/

export function findChars(haystack, needle, offset=0){

	var pos = haystack.indexOf(needle, offset);

	//base case
	if(pos === -1){
		return false;
	}
	//recursion
	else{
		var littleArr = [pos, pos + needle.length - 1];
		var arr = [littleArr];
		var otherArr = findChars(haystack, needle, pos + needle.length);
		if(otherArr){
			for(var littleArr of otherArr){
				arr.push(littleArr);
			}
		}
		return arr;
	}

}