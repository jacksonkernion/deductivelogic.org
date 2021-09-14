<script>
	import {unfancyLogStr, dispLogStr, escapeRegExp} from '$lib/utils';
	import {connectives} from '$lib/stores';

	export let logStr = '';
    export let label = null;
    export let name = null;

	let input;

	/* Problem: 'shift' mixed with "<", ">", or any chosen shortcut mucks this up
	const endingChars = [
			'A',
			'E',
			'=',
			$connectives.andShortcuts.slice(-1),
			$connectives.orShortcuts.slice(-1),
			$connectives.notShortcuts.slice(-1),
			$connectives.conditionalShortcuts.slice(-1),
			$connectives.biconditionalShortcuts.slice(-1),
		];
	*/

	function insertSymbol(symbol) {
		var selectionStart = input.selectionStart;
		var selectionEnd = input.selectionEnd;
		var newValue = input.value.substr(0, selectionStart) + symbol + input.value.substr(selectionEnd);
		input.value = newValue;
		input.focus();
		input.setSelectionRange(selectionStart + 1, selectionStart + 1);
		
	}

	function replaceSymbols() {

		if(input){

			let str = input.value;
			let selectionStart = input.selectionStart;
			let selectionEnd = input.selectionEnd;
			let offset = 0;
			let initialLength = str.length;
			
			let fixed = '';
			let regex = new RegExp(escapeRegExp($connectives.biconditionalShortcuts), "g");
			fixed = str.replace(regex, $connectives.biconditionalSymbol);
			regex = new RegExp(escapeRegExp($connectives.conditionalShortcuts), "g");
			fixed = fixed.replace(regex, $connectives.conditionalSymbol);
			regex = new RegExp(escapeRegExp($connectives.andShortcuts), "g");
			fixed = fixed.replace(regex, $connectives.andSymbol);
			regex = new RegExp(escapeRegExp($connectives.orShortcuts), "g");
			fixed = fixed.replace(regex, $connectives.orSymbol);
			regex = new RegExp(escapeRegExp($connectives.notShortcuts), "g");
			fixed = fixed.replace(regex, $connectives.notSymbol);
			fixed = fixed.replace(/A/g,"\u2200");
			fixed = fixed.replace(/E/g,"\u2203");
			fixed = fixed.replace(/!=/g,"≠");

			if(fixed != str){
				//If shortcut is longer than actual symbol (Ex: '<>' for '≡'), need to change where caret is
				if(fixed.length != initialLength){
					offset = initialLength - fixed.length;
				}
				input.value = fixed;
				input.focus();
				input.setSelectionRange(selectionStart - offset, selectionEnd - offset);

				logStr = unfancyLogStr(fixed, $connectives);
			}

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
		value={dispLogStr(logStr, $connectives)}
		bind:this={input} 
		on:input={replaceSymbols} />
	
	<div class="logStrInput-buttons-wrapper fl">
		<div class="logStrInput-button" on:click={() => insertSymbol($connectives.notSymbol)}>{$connectives.notSymbol}</div>
		<div class="logStrInput-button" on:click={() => insertSymbol($connectives.andSymbol)}>{$connectives.andSymbol}</div>
		<div class="logStrInput-button" on:click={() => insertSymbol($connectives.orSymbol)}>{$connectives.orSymbol}</div>
		<div class="logStrInput-button" on:click={() => insertSymbol($connectives.conditionalSymbol)}>{$connectives.conditionalSymbol}</div>
		<div class="logStrInput-button" on:click={() => insertSymbol($connectives.biconditionalSymbol)}>{$connectives.biconditionalSymbol}</div>
		<div class="logStrInput-button" on:click={() => insertSymbol('∀')}>∀</div>
		<div class="logStrInput-button" style="margin-right:0px;" on:click={() => insertSymbol('∃')}>∃</div>
	</div>
</div>