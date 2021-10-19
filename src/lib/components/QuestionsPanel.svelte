<script>

    import Button from "./atoms/Button.svelte";
    import supabase from "$lib/db";
    import {session} from "$app/stores";

    export let questions = [];
    export let replies = [];
    export let problem_id = null;
    export let isAdmin = false;
    let draftQuestion = {
        user_id: $session.user.id,
        problem_id: problem_id,
        content: ''
    };

    async function sendQuestion() {

        questions = [...questions, draftQuestion];
        
        const res1 = await supabase
            .from('questions')
            .upsert(draftQuestion);
        if (res1.error){
            alert(error.error_description || error.message);
            //TODO Visually update non-sent message?
        }

        draftQuestion.content = '';
        
    }

</script>

{#each questions as question}
    <div>
        <p>{question.content}</p>
        {#each replies.filter(reply => reply.question_id === question.id) as reply}
            <p>{reply}</p>
        {/each}
        {#if isAdmin}
            <Button>Reply...</Button>
        {/if}
    </div>
{/each}

<form on:submit|preventDefault={sendQuestion}>
    <textarea bind:value={draftQuestion.content} placeholder="Markdown"/>
    <Button icon="send" type="submit"/>
</form>

