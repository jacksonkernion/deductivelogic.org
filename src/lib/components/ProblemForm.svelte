<script>
    import {problemTypes} from '$lib/constants.js';
    import Button from '$lib/components/atoms/Button.svelte';
    import LogStrInput from '$lib/components/problems/sub-components/LogStrInput.svelte';
    import Input from '$lib/components/atoms/Input.svelte';

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
    .end-button{
        position: absolute;
        left: 30.5rem;
        margin-top: 2px;
    }
</style>

<div>
    {#each Object.entries(problemTypes[problem.type].attributes) as [attr, description]}

        <div class="mt3 inputWrapper relative">	

            {#if attr=='answer'}
                <div class="w-90">
                    <Input label={description} name="logStr" bind:value={problem.logStr} />
                </div>
            {/if}

            {#if attr=='sent'}
                <div class="w-90">
                    <Input label={description} name={attr} bind:value={problem[attr]} />
                </div>
            {/if}

            {#if attr=='logStr' || attr=='logStr1' || attr=='logStr2'}
                <div class="w-90">
                    <LogStrInput label={description} bind:logStr={problem[attr]} />
                </div>
            {/if}

            {#if attr=='logStrSet' && problem.logStrSet}
                <div class="f6 fw5 db mb2 mt3">{@html description}</div>
                {#each problem.logStrSet as logStr, i}
                    <div class="end-button">
                        <Button icon="close-outline" on:click={() => removeLogStr(i)} />
                    </div>
                    <div class="w-90">
                        <LogStrInput bind:logStr />
                    </div>
                {/each}
                <div class="lh-copy f6 mt3">
                    <a on:click={addLogStr}>+ Add schema</a>
                </div>
                
            {/if}

            {#if attr=='sentSet' && problem.type == 'quantInterp'}
                <div class="f6 fw5 db mb2 mt3">{@html description}</div>
                <div class="ml2">
                    <div class="mb2">
                        <input class="mr2" type=radio bind:group={problem.sentSet} name="implies" value={['true']}  />
                        <label class="lh-copy f6 black-70">True</label>
                    </div>
                    <div class="mb2">
                        <input class="mr2" type=radio bind:group={problem.sentSet} name="implies" value={['false']}  />
                        <label class="lh-copy f6 black-70">False</label>
                    </div>
                    <div>
                        <input class="mr2" type=radio bind:group={problem.sentSet} name="implies" value={['true', 'false']} />
                        <label class="lh-copy f6 black-70">True & False</label>
                    </div>
                </div>

            {:else if attr=='sentSet' && problem.sentSet}
                <div class="f6 fw5 db mb2">{@html description}</div>
                {#each problem.sentSet as sent, i}
                    <div class="end-button">
                        <Button icon="close-outline" on:click={() => removeSentence(i)} />
                    </div>
                    <div class="w-90">
                        <Input name={attr} bind:value={sent} />
                    </div>
                    
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

            
        </div>

    {/each}

</div>