<script>
	import {unfancyLogStr} from '$lib/helpers.js';
	import {symbols} from '$lib/stores';

	export let logStr = '';
    export let label = null;
    export let name = null;

	let value = '';
	let input;

	$: logStr = unfancyLogStr(value);

	function insertSymbol(symbol) {
		var selectionStart = input.selectionStart;
		var selectionEnd = input.selectionEnd;
		var newValue = input.value.substr(0, selectionStart) + symbol + input.value.substr(selectionEnd);
		input.value = newValue;
		input.focus();
		input.setSelectionRange(selectionStart + 1, selectionStart + 1);
		
	}

	function replaceSymbol(e) {
		
		// Fix later: check for ending char in any of $symbols keyboard shortcuts
		if(e.key == '-' || e.key == 'v' || e.key == '>'  || e.key == 'A' || e.key == 'E' ){
		
			var selectionStart = e.target.selectionStart;
			var selectionEnd = e.target.selectionEnd;
			var offset = 0;
			var initialLength = value.length;
			
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
			// fixed= fixed.replace("^","\u2227"); [from emer17.js, not sure?]
			// regex = new RegExp(or.shortcut, "g");
			// regex = new RegExp('|', "g");
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
			
			//If shortcut is longer than actual symbol (Ex: '<>' for '≡'), need to change where caret is
			if(fixed.length != initialLength){
				var offset = initialLength - fixed.length;
			}
			e.target.value = fixed;
			e.target.focus();
			e.target.setSelectionRange(selectionStart - offset, selectionEnd - offset);
		}
	}
</script>

<style>
	input{
        transition: all 0.15s ease-in-out;
        color: #4D4D4D;

    }

    input:focus {
        outline: 0;
        border-color: #5584EB;
        box-shadow: inset 0 0 0 0.1rem #5584EB;
    }
	
	.logStrInput-buttons-wrapper {
		
	}
	.logStrInput-button {
		display: inline-block;
		text-align: center;
		font-size: 20px;
		margin-right: .15rem;
		min-width: 28px;
		min-height: 28px;
		border: 1px solid rgb(192, 192, 192);
		border-radius: .18rem;
		color: #aaa;

		align-items: center;
		justify-content: center;
	}
	.logStrInput-button:hover {
		cursor: pointer;
		color: #333;
		background-color: #eee;
		opacity: .8;
	}

</style>

<div class="mb3 cf">
	{#if label}
		<label for={name} class="f6 fw5 db mb2">{@html label}</label>
	{/if}
	<input id={name} class="logStr input-reset br2 ba b--black-20 pa2 mb2 dib w-100" type="text" 
		autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
		bind:value
		bind:this={input} 
		on:keyup={replaceSymbol} />
	
	<div class="logStrInput-buttons-wrapper fl">
		<div class="logStrInput-button" on:click={() => insertSymbol('–')}>–</div>
		<div class="logStrInput-button" on:click={() => insertSymbol('.')}>.</div>
		<div class="logStrInput-button" on:click={() => insertSymbol('∨')}>∨</div>
		<div class="logStrInput-button" on:click={() => insertSymbol('⊃')}>⊃</div>
		<div class="logStrInput-button" on:click={() => insertSymbol('≡')}>≡</div>
		<div class="logStrInput-button" on:click={() => insertSymbol('∀')}>∀</div>
		<div class="logStrInput-button" style="margin-right:0px;" on:click={() => insertSymbol('∃')}>∃</div>
	</div>
</div>