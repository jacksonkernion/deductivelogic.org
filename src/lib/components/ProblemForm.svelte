<script>
    import {problemTypes} from '$lib/problemTypes.js';
    import LogStrInput from '$lib/components/LogStrInput.svelte';
    import Button from '$lib/jui-components/Button.svelte';

    export let problem;
    export let mode = 'create';

    function addLogStr(){
        problem.logStrSet = [...problem.logStrSet, ''];
    }
    function removeLogStr(index){
        problem.logStrSet = problem.logStrSet.filter( (e,i) => i !== index );
    }
    function addSentence(){
        problem.sentSet = [...problem.sentSet, ''];
    }
    function removeSentence(index){
        problem.sentSet = problem.sentSet.filter( (e,i) => i !== index );
    }

</script>

<div>
    {#each Object.entries(problemTypes[problem.type].attributes) as [attr, description]}

        <div class="inputWrapper">	

            <label>{@html description}</label>

            {#if attr=='question' || attr=='answer' || attr=='sent'}
                <input bind:value={problem[attr]} />
            {/if}

            {#if attr=='logStr' || attr=='logStr1' || attr=='logStr2'}
                <LogStrInput bind:logStr={problem[attr]} />
            {/if}

            {#if attr=='logStrSet' && problem.logStrSet}
                {#each problem.logStrSet as logStr, i}
                    <button class="f6 br1 ba ph3 pv2 mb2 dib black" on:click={() => removeLogStr(i)}>X</button>
                    <LogStrInput bind:logStr />
                {/each}
                <a on:click={addLogStr}>+ Add schema</a>
            {/if}

            {#if attr=='sentSet' && problem.sentSet}
                {#each problem.sentSet as sent, i}
                    <button class="f6 br1 ba ph3 pv2 mb2 dib black" on:click={() => removeSentence(i)}>X</button>
                    <input bind:value={sent} />
                {/each}
                {#if problem.type == 'quantParaphrase'}
                    <a on:click={addSentence}>+ Add predicate specification</a>
                {:else if problem.type == 'fillBlanks'}
                    <a on:click={addSentence}>+ Add fill</a>
                {:else}
                    <a on:click={addSentence}>+ Add sentence</a>
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
        <button class="f6 br1 ba ph3 pv2 mb2 black" on:click>Update</button>
        <button class="f6 br1 ba ph3 pv2 mb2 black">Cancel</button>
    {:else if mode=='generate'}
        <button class="f6 br1 ba ph3 pv2 mb2 black" type="submit" on:click>Generate Problem</button>
    {:else}
        <button class="f6 br1 ba ph3 pv2 mb2 black" type="submit" on:click>Add Problem</button>
	{/if}

</div>