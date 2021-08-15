<script>
    import {problemTypes} from '$lib/problemTypes.js';
    import LogStrInput from '$lib/components/LogStrInput.svelte';
    import Input from '$lib/components/Input.svelte';

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

<style>
    .remove-button{
        position: absolute;
        left: 30.5rem;
        line-height: .8;
        color: #999;
        border: 1px solid white;
        border-radius: .25rem;
    }
    .remove-button:hover{
        border-color: rgba(0,0,0,.2);
        cursor: pointer;
        color: #333;
    }
</style>

<div>
    {#each Object.entries(problemTypes[problem.type].attributes) as [attr, description]}

        <div class="mt3 inputWrapper relative">	

            {#if attr=='question' || attr=='answer' || attr=='sent'}
                <Input label={description} name={attr} bind:value={problem[attr]} />
            {/if}

            {#if attr=='logStr' || attr=='logStr1' || attr=='logStr2'}
                <LogStrInput label={description} bind:logStr={problem[attr]} />
            {/if}

            {#if attr=='logStrSet' && problem.logStrSet}
                <div class="f6 fw5 db mb2 mt3">{@html description}</div>
                {#each problem.logStrSet as logStr, i}
                    <div class="remove-button pa2" on:click={() => removeLogStr(i)}>
                        <ion-icon name="close-outline"></ion-icon>
                    </div>
                    <LogStrInput bind:logStr />
                {/each}
                <div class="lh-copy f6 mt3">
                    <a on:click={addLogStr}>+ Add schema</a>
                </div>
                
            {/if}

            {#if attr=='sentSet' && problem.sentSet}
                <div class="f6 fw5 db mb2 mt3">{@html description}</div>
                {#each problem.sentSet as sent, i}
                    <div class="remove-button pa2" on:click={() => removeSentence(i)}>
                        <ion-icon name="close-outline"></ion-icon>
                    </div>
                    <Input name={attr} bind:value={sent} />
                    
                {/each}
                <div class="lh-copy f6 mt3">
                    {#if problem.type == 'quantParaphrase'}
                        <a on:click={addSentence}>+ Add predicate specification</a>
                    {:else if problem.type == 'multipleChoice'}
                        <a on:click={addSentence}>+ Add option</a>
                    {:else if problem.type == 'fillBlanks'}
                        <a on:click={addSentence}>+ Add fill</a>
                    {:else}
                        <a on:click={addSentence}>+ Add sentence</a>
                    {/if}
                </div>
                
            {/if}

            {#if attr=='interpsRequested'}
                <div class="f6 fw5 db mb2 mt3">{@html description}</div>
                <div class="ml2">
                    <div class="mb2">
                        <input class="mr2" type=radio bind:group={problem.interpsRequested} name="implies" value="true" />
                        <label class="lh-copy f6 black-70">True</label>
                    </div>
                    <div class="mb2">
                        <input class="mr2" type=radio bind:group={problem.interpsRequested} name="implies" value="false" />
                        <label class="lh-copy f6 black-70">False</label>
                    </div>
                    <div>
                        <input class="mr2" type=radio bind:group={problem.interpsRequested} name="implies" value="true/false" />
                        <label class="lh-copy f6 black-70">True & False</label>
                    </div>
                </div>
            {/if}
            
        </div>

    {/each}

    <div class="cf measure">
        {#if mode=='update'}
            <button class="fr mt4 f6 br2 ba ph3 pv2 mb2 black" on:click>Update</button>
            <button class="fr mt4 f6 br2 ba ph3 pv2 mb2 black">Cancel</button>
        {:else if mode=='generate'}
            <button class="fr mt4 f6 br2 ba ph3 pv2 mb2 black" type="submit" on:click>Generate Problem</button>
        {:else}
            <button class="fr mt4 f6 br2 ba ph3 pv2 mb2 black" type="submit" on:click>Add Problem</button>
        {/if}
    </div>
</div>