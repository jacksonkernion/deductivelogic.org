<script>

    import Button from "./atoms/Button.svelte";
    import Textarea from "./atoms/Textarea.svelte";
    import supabase from "$lib/db";
    import sanitizeHtml from 'sanitize-html';
    import showdown from 'showdown';
    import { format } from 'timeago.js';
    import {session, page} from "$app/stores";
    import { tick } from 'svelte';

    var converter = new showdown.Converter();

    export let questions = [];
    export let problem_id = null;
    export let isAdmin = false;
    export let number = null;
    
    let questionForm;
    let questionButton;
    let buttonHidden = true;
    let replyForms = questions.map((q) => {
        return {form: null, textarea: null, button: null, hidden: true, buttonHidden: true};
    });



    function hideQuestionButton(){
        // Make sure blur event isn't cause by submitting form
        if (!questionButton.parentNode.matches(":hover")) {
            buttonHidden = true;
        }
    }

    function hideReplyButton(index){
        // Make sure blur event isn't cause by submitting form
        if (!replyForms[index].button.parentNode.matches(":hover")) {
            replyForms[index].buttonHidden = true;
        }
    }

    async function showReply(index){
        replyForms[index].hidden = false;
        await tick();
        replyForms[index].textarea.focus();
    }

    async function sendQuestion() {
        const formData = new FormData(questionForm);
        questionForm.reset();
        buttonHidden = true;
        const data = {};
        for (let field of formData) {
            const [key, value] = field;
            data[key] = value;
        }
        data.user_id = $session.user.id;
        data.problem_id = problem_id;
        data.content = converter.makeHtml(data.content);

        replyForms = [...replyForms, {form: null, textarea: null, button: null, hidden: true, buttonHidden: true}];
        questions = [...questions, {...data, replies:[]}];
        
        const res1 = await supabase
            .from('questions')
            .upsert(data);
        if (res1.error){
            alert(error.error_description || error.message);
            //TODO Visually update non-sent message?
        }
        else{
            questions[questions.length - 1].id = res1.data[0].id
        }

        const res2 = await fetch('/notify', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'same-origin',
            body: JSON.stringify({
                notificationType: "New Question",
                askedBy: $session.user.firstName + ' ' + $session.user.lastName,
                question: data.content,
                problem_id: problem_id,
                problemNumber: number,
                url: $page.host + $page.path + '#problem' + number
            })
        });

    }

    async function sendReply(index) {

        const formData = new FormData(replyForms[index].form);
        replyForms[index].form.reset();
        const data = {};
        for (let field of formData) {
            const [key, value] = field;
            data[key] = value;
        }
        data.user_id = $session.user.id;
        data.content = converter.makeHtml(data.content);

        questions[index].replies = [...questions[index].replies, data];
        
        const res1 = await supabase
            .from('replies')
            .upsert(data);
        if (res1.error){
            alert(error.error_description || error.message);
            //TODO Visually update non-sent message?
        }
        else{
            //update with the id of the newly created reply
            questions[index].replies[questions[index].replies.length - 1].id = res1.data[0].id
        }

        const res2 = await fetch('/notify', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'same-origin',
            body: JSON.stringify({
                notificationType: "New Reply",
                repliedBy: $session.user.firstName + ' ' + $session.user.lastName,
                reply: data.content,
                problem_id: problem_id,
                question_id: data.question_id,
                problemNumber: number,
                url: $page.host + $page.path + '#problem' + number
            })
        });

    }

</script>

<style>
    div :global(p) {
        margin: .35rem 0;
    }
</style>

<div class="mt3">

    {#if questions.length > 0}

        <div classs="lh-copy w-100 mt-1">
            {#each questions as question, i (question.id)}
                <div class="f7 fw4 pb2 mb2 bb b--black-10">
                    <div class="black-70">{@html sanitizeHtml(question.content)}</div>
                    {#if isAdmin}
                        <div class="black-40"><span class="fw5">{format(question.created_at)}</span> <span hidden={!replyForms[i].hidden}>・ <a on:click={showReply(i)}>Reply</a></span></div>
                    {:else}
                        <div class="black-40">{format(question.created_at)}</div>
                    {/if}
                    {#if question.replies && question.replies.length > 0}
                        {#each question.replies as reply}
                            <div class="black-70 ml3">{@html sanitizeHtml(reply.content)}</div>
                        {/each}
                    {:else if isAdmin}
                        <form bind:this={replyForms[i].form} class="cf" hidden={replyForms[i].hidden} on:submit|preventDefault={sendReply(i)}>
                            <Textarea 
                                bind:textarea={replyForms[i].textarea}
                                name="content"
                                placeholder="Add a reply..."
                                on:focus={() => {replyForms[i].buttonHidden = false}}
                                on:blur={hideReplyButton(i)} />
                            <input name="question_id" type="hidden" value={question.id}/>
                            <div class="fr" hidden={replyForms[i].buttonHidden}>
                                <Button bind:button={replyForms[i].button} type="submit" size="small">Reply</Button>
                            </div>
                        </form>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}

    {#if !$session.user.guest}
        <div class="pv2 f7">
            <form bind:this={questionForm} class="cf" on:submit|preventDefault={sendQuestion}>
                <Textarea name="content" placeholder="Ask a question..." on:focus={() => {buttonHidden = false}} on:blur={hideQuestionButton} />
                <div class="fr">
                    <Button bind:button={questionButton} type="submit" size="small">Send</Button>
                </div>
            </form>
        </div>
    {/if}
    
</div>




    
