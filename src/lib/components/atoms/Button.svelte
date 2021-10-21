<script>
    // Inspired by sveltekit-jui Button component: https://sveltekit-jui-wolfr.vercel.app/styleguide/components/button
    
    // a link, type="button" or type="submit"
    export let type = false;

    // if it contains a link
    export let href = false;

    // Disabled
    export let disabled = false;
    
    // Styling
    export let icon = null;
    export let active = null;
    export let size = 'normal';
    export let fullwidth = false;
</script>

<style>

    .button{
        display: inline-block;
        appearance: none; /* Fix for Mobile Safari */
        text-decoration: none; /* to reset <a> element */
        font-size: .875rem;
        font-weight: 400;
        line-height: 1.15;
        padding: .5rem 1rem;
        color: #333;
        border: 1px solid rgb(192, 192, 192);
        border-radius: .25rem;
        outline: none;
        background-color: transparent;
    }

    /* unused? To solve icon alignment issue, just put button inside of <a> element instead, and that worked */
    a.button {
        /* display: inline-flex; */
        justify-content: center;
        vertical-align: middle;
        margin: 0;
    }

    .button:hover{
        cursor: pointer;
        color: black;
        background-color: #eee;
        border-color: #999;
    }

    .button-disabled{
        /* background: #eee; */
        color: rgba(0,0,0,.1) !important;
        /* pointer-events: none; */
        border: none;
    }

    .button-disabled:hover {
        cursor: not-allowed;
        background-color: transparent;
    }

    .button-active{
        background: #eee;
        color: #666;
    }

    .button-small{
        font-size: .75rem;
        font-weight: 400;
        line-height: 1.15;
        padding: .25rem .5rem;
        color: #333;
        border: 1px solid rgb(192, 192, 192);
        border-radius: .125rem;
    }

    .fullwidth{
        width: 100%;
    }

    /* icon Button (Square) */

    .button-icon{
        border-color: transparent;
        color: #bbb;
        text-align: center;
        align-items: center;
        justify-content: center;
        height: 2rem;
        width: 2rem;
        padding: 0;
        /* display: inline-flex; */
    }
    .button-icon.button-active{
        border-color:#eee;
    }

    .button-icon:hover{
        color: #333;
        border-color: transparent;
    }

    ion-icon{
        margin-top: 2px;
        font-size: 16px;
        --ionicon-stroke-width: 44px;
        z-index:60;
        visibility: visible;
    }
    
</style>

{#if href}
    <a
        href="{href}"
    >
        <button
        class="button"
        {disabled}
        class:button-icon={icon}
        class:button-disabled={disabled}
        class:button-active={active}
        class:button-small={size === 'small'}
        >
            {#if icon}
                <ion-icon name={icon}></ion-icon>
            {/if}
            <slot></slot>
        </button>
   </a>
{:else}
    {#if type == "submit"}
        <button
            type="submit"
            {disabled}
            class="button"
            class:button-icon={icon}
            class:button-disabled={disabled}
            class:button-active={active}
            class:button-small={size === 'small'}
            class:fullwidth={fullwidth}
        >
            {#if icon}
                <ion-icon name={icon}></ion-icon>
            {/if}
            <slot></slot>
        </button>
    {:else}
        <button
            type="button"
            {disabled}
            class="button"
            class:button-icon={icon}
            class:button-disabled={disabled}
            class:button-active={active}
            class:button-small={size === 'small'}
            on:submit|preventDefault on:click|preventDefault
        >
            {#if icon}
                <ion-icon name={icon}></ion-icon>
            {/if}
            <slot></slot>
        </button>
    {/if}
{/if}