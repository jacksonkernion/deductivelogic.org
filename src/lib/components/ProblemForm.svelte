<script>
    import {problemTypes} from '$lib/problemTypes.js';
    import LogStrInput from '$lib/components/LogStrInput.svelte';

    export let problem;
    export let mode = 'create';

    if (problem.logStrSet)
        $: logStrSetArr = problem.logStrSet.split(',');
    if (problem.sentSet)
        $: sentSetArr = problem.sentSet.split('/');

    function handleAddLogStr(){

    }
    function handleAddSentence(){
        
    }

</script>

<div>
    {#each Object.entries(problemTypes[problem.type].attributes) as [attr, description]}

        <div class="inputWrapper">	

            <label>{description}</label>

            {#if attr=='question' || attr=='answer' || attr=='sent'}
                <input bind:value={problem[attr]} />
            {/if}

            {#if attr=='logStr' || attr=='logStr1' || attr=='logStr2'}
                <LogStrInput bind:logStr={problem[attr]} />
            {/if}

            {#if attr=='logStrSet' && problem.logStrSet}
                {#each logStrSetArr as logStr, i}
                    <LogStrInput bind:logStr />
                {/each}
                <a on:click={handleAddLogStr}>+ Add schema</a>
            {/if}

            {#if attr=='sentSet' && problem.sentSet}
                {#each sentSetArr as sent, i}
                    <input bind:value={sent} />
                {/each}
                {#if problme.type!='fillBlanks'}
                    <a on:click={handleAddSentence}>+ Add sentence</a>
                {:else}
                    <a on:click={handleAddSentence}>+ Add fill</a>
                {/if}

                
            {/if}

            {#if attr=='interpsRequested'}
                <select bind:value={problem.interpsRequested}>
                    <option value="true">True</option>
                    <option value="false">False</option>
                    <option value="true/false">True and False</option>
                </select>
            {/if}
            
        </div>

    {/each}

    {#if mode=='update'}
        <button>Update</button>
        <button>Cancel</button>
    {:else if mode=='generate'}
        <button type="submit">Generate Problem</button>
    {:else}
        <button type="submit">Create</button>
	{/if}
</div>