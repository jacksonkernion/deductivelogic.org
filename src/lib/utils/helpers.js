export function dispLogStr(logStr, connectives){
    for(var i=0; i < logStr.length; i++){
        if(logStr[i] == "<" && logStr[i+1] == ">")
            logStr = logStr.substring(0, i) + connectives.biconditionalSymbol + logStr.substring(i+2);
        else if(logStr[i] == ">")
            logStr = logStr.substring(0, i) + connectives.conditionalSymbol + logStr.substring(i+1);
        else if(logStr[i] == "|")
            logStr = logStr.substring(0, i) + connectives.orSymbol + logStr.substring(i+1);
        else if(logStr[i] == ".")
            logStr = logStr.substring(0, i) + connectives.andSymbol + logStr.substring(i+1);
        else if(logStr[i] == "-")
            logStr = logStr.substring(0, i) + connectives.notSymbol + logStr.substring(i+1);
        else if(logStr[i] == "A")
            logStr = logStr.substring(0, i) + "∀" + logStr.substring(i+1);
        else if(logStr[i] == "E")
            logStr = logStr.substring(0, i) + "∃" + logStr.substring(i+1);
    }

    return logStr;
}

export function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function unfancyLogStr(str, connectives){
	let fixed = str;
    let regex = new RegExp(escapeRegExp(connectives.biconditionalSymbol), "g");
	fixed= fixed.replace(regex, "<>");
    regex = new RegExp(escapeRegExp(connectives.conditionalSymbol), "g");
	fixed = fixed.replace(regex, ">"); 
	fixed = fixed.replace(/\u2200/g, "A");
	fixed = fixed.replace(/\u2203/g, "E");
    regex = new RegExp(escapeRegExp(connectives.orSymbol), "g");
	fixed = fixed.replace(regex, "|");
    regex = new RegExp(escapeRegExp(connectives.notSymbol), "g");
	fixed = fixed.replace(regex, "-");
    regex = new RegExp(escapeRegExp(connectives.andSymbol), "g");
	fixed = fixed.replace(regex, ".");
	fixed = fixed.replace(/≠/g,"!=");
	return fixed;
}

/*function factorial(int){
	if(int < 2) {
		return 1;
	}

	for(var f = 2; (int-1) > 1; f *= int--);

	return f;
} 
*/

export function shuffle(array) {
	var currentIndex = array.length,  randomIndex;
  
	// While there remain elements to shuffle...
	while (currentIndex != 0) {
  
	  // Pick a remaining element...
	  randomIndex = Math.floor(Math.random() * currentIndex);
	  currentIndex--;
  
	  // And swap it with the current element.
	  [array[currentIndex], array[randomIndex]] = [
		array[randomIndex], array[currentIndex]];
	}
  
	return array;
}

function factorial(n){
	return !(n > 1) ? 1 : factorial(n - 1) * n;
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
		// calling arr.slice() because, otherwise, we pass by reference, and end up altering 'arr', which we don't want here.
		p.push(perm(arr.slice(), i));
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

export function slugify(str)
{
    str = str.replace(/^\s+|\s+$/g, '');

    // Make the string lowercase
    str = str.toLowerCase();

    // Remove accents, swap ñ for n, etc
    var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
    var to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    // Remove invalid chars
    str = str.replace(/[^a-z0-9 -]/g, '') 
    // Collapse whitespace and replace by -
    .replace(/\s+/g, '-') 
    // Collapse dashes
    .replace(/-+/g, '-'); 

    return str;
}