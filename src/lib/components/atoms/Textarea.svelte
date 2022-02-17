<script>
	export let value = '';
    export let name = null;
    export let placeholder = null;
	export let minRows = 1;
	export let maxRows;
    export let textarea = null;
	
	$: minHeight = `${1 + minRows * 1.2}em`;
	$: maxHeight = maxRows ? `${1 + maxRows * 1.2}em` : `auto`;
</script>

<style>
	.container {
		position: relative;
	}
	
	pre, textarea {
        font-family: inherit;
		padding: 0.5rem;
		box-sizing: border-box;
        border-radius: .25rem;
		border: 1px solid rgba(0,0,0,.2);
		line-height: 1.2;
		overflow: hidden;
	}
	
	textarea {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		resize: none;
        transition: all 0.15s ease-in-out;
        color: #4D4D4D;
	}

    textarea:focus {
        outline: 0;
        border-color: #5584EB;
        box-shadow: inset 0 0 0 0.1rem #5584EB;
    }
</style>

<div class="container">
	<pre
		aria-hidden="true"
		style="min-height: {minHeight}; max-height: {maxHeight}"
	>{value + '\n'}</pre>

	<textarea {name} {placeholder} bind:value bind:this={textarea} on:focus on:blur class="input-reset"></textarea>	
</div>

