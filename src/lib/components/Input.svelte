<script>
    // Mostly copied from Svelte-jui

    export let value = null;
    export let label = null;
    export let name = null;
    export let desc = null;
    export let type = "text";
    export let placeholder = null;
  
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

</style>

<div class="black-80 measure">
    <label for={name} class="f6 fw5 db mb2">{@html label}</label>
    {#if type == "password"}
        <input id={name} class="input-reset br2 ba b--black-20 pa2 mb2 db w-100" {placeholder} type="password" aria-describedby={desc} bind:value={value} />
    {/if}
    {#if type == "email"}
        <input id={name} class="input-reset br2 ba b--black-20 pa2 mb2 db w-100" {placeholder} type="email" aria-describedby={desc} bind:value={value} />
    {/if}
    {#if !type || type == "text"}
        <input id={name} class="input-reset br2 ba b--black-20 pa2 mb2 db w-100" {placeholder} type="text" aria-describedby={desc} bind:value={value}  />
    {/if}

</div>