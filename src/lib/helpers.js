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