<script>
	import {unfancyLogStr} from '$lib/helpers.js';

	export let logStr = '';
	let value = '';
	let input;
	$: logStr = unfancyLogStr(value);

	function getCaretPosition(ctrl) {
		// IE < 9 Support 
		if (document.selection) {
			ctrl.focus();
			var range = document.selection.createRange();
			var rangelen = range.text.length;
			range.moveStart('character', -ctrl.value.length);
			var start = range.text.length - rangelen;
			return {
				'start': start,
				'end': start + rangelen
			};
		} // IE >=9 and other browsers
		else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
			return {
				'start': ctrl.selectionStart,
				'end': ctrl.selectionEnd
			};
		} else {
			return {
				'start': 0,
				'end': 0
			};
		}
	}

	function setCaretPosition(ctrl, start, end) {
		// IE >= 9 and other browsers
		if (ctrl.setSelectionRange) {
			ctrl.focus();
			ctrl.setSelectionRange(start, end);
		}
		// IE < 9 
		else if (ctrl.createTextRange) {
			var range = ctrl.createTextRange();
			range.collapse(true);
			range.moveEnd('character', end);
			range.moveStart('character', start);
			range.select();
		}
	}

	function insertSymbol(symbol) {
		var newValue = value.substr(0, input.selectionStart) + symbol + value.substr(input.selectionEnd);
		value = newValue;
		// input.focus();
		// input.setSelectionRange(input.selectionStart + 1, input.selectionStart + 1);
		
	}

	function replaceSymbol(e) {
		// var unicode = e.charCode? e.charCode : e.keyCode;
		//if(unicode == 190 || unicode == 65 || unicode == 69 || unicode == 86){
		//Add a condition to check that $(this).val() contains one of these letters, to stop unnecessary function runs...

		//Later: fix caret placement: https://developer.mozilla.org/en-US/docs/Web/API/Range
    	var selectionStart = e.target.selectionStart;
		var selectionEnd = e.target.selectionEnd;
		var offset = 0;
		
    	var fixed = '';
    	// var regex = new RegExp(biconditional.shortcut, "g");
		var regex = new RegExp('<>', "g");
    	// var fixed = value.replace(regex, biconditional.symbol);
		var fixed = value.replace(regex, '≡');
    	// regex = new RegExp(conditional.shortcut, "g");
		regex = new RegExp('>', "g");
		// fixed = fixed.replace(regex, conditional.symbol);
		fixed = fixed.replace(regex, '⊃'); 
		fixed = fixed.replace(/A/g,"\u2200");
		fixed = fixed.replace(/E/g,"\u2203");
		//fixed= fixed.replace("^","\u2227"); [from emer17.js, not sure?]
		// regex = new RegExp(or.shortcut, "g");
		//regex = new RegExp('|', "g");
		// fixed= fixed.replace(regex, or.symbol);
		fixed = fixed.replace(/v/g, '∨');
		// regex = new RegExp(not.shortcut, "g");
		regex = new RegExp('-', "g");
		// fixed= fixed.replace(/-/g, not.symbol);
		fixed = fixed.replace(/-/g, '–');
		/*
		if(and.shortcut == '.'){
			fixed= fixed.replace(/\./g,and.symbol);
		}
		else if(and.shortcut == '^'){
			fixed= fixed.replace(/\^/g,and.symbol);
		}
		else{
			regex = new RegExp(and.shortcut, "g");
			fixed= fixed.replace(regex,and.symbol);
		} */
		fixed = fixed.replace(/!=/g,"≠");
		
		//If shortcut longer than actual symbol, need to change where caret is
		
		if(fixed.length != value.length){
			var offset = input.value.length - fixed.length;
    	}
		value = fixed;
		e.target.setSelectionRange(selectionStart - offset, selectionEnd - offset);	
	}
</script>

<style>
	input {
		font-size: 20px;
		border: 1px solid #ccc;
		padding: 3px;
		width: 400px;
	}
	.logStrInput-wrapper{
		width: 408px;
		margin: 30px auto 30px auto;
	}
	.logStrInput-button-wrapper {
		margin: 0px auto;
	}
	.logStrInput-button {
		display: inline-block;
		text-align: center;
		font-size: 20px;
		margin: 10px 10px 10px 0px;
		min-width: 28px;
		min-height: 28px;
		border: 1px solid #ccc;
		color: #ccc;
	}
	.logStrInput-button:hover {
		cursor: pointer;
		border: 1px solid black;
		color: black;
	}

</style>

<div class="logStrInput-wrapper">
	<input type="text" bind:this={input} bind:value on:keyup={replaceSymbol} />
	<div class="logStrInput-button-wrapper">
		<div class="logStrInput-button" on:click={() => insertSymbol('–')}>–</div>
		<div class="logStrInput-button" on:click={() => insertSymbol('.')}>.</div>
		<div class="logStrInput-button" on:click={() => insertSymbol('∨')}>∨</div>
		<div class="logStrInput-button" on:click={() => insertSymbol('⊃')}>⊃</div>
		<div class="logStrInput-button" on:click={() => insertSymbol('≡')}>≡</div>
		<div class="logStrInput-button" on:click={() => insertSymbol('∀')}>∀</div>
		<div class="logStrInput-button" style="margin-right:0px;" on:click={() => insertSymbol('∃')}>∃</div>
	</div>
</div>