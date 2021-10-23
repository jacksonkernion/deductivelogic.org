<script>

    import Button from "./atoms/Button.svelte";
    import supabase from "$lib/db";
    import sanitizeHtml from 'sanitize-html';
    import showdown from 'showdown';
    import {session, page} from "$app/stores";

    var converter = new showdown.Converter();

    export let questions = [];
    export let problem_id = null;
    export let isAdmin = false;
    export let number = null;

    async function sendQuestion(e) {

        const formData = new FormData(e.target);
        e.target.reset();
        const data = {};
        for (let field of formData) {
            const [key, value] = field;
            data[key] = value;
        }
        data.user_id = $session.user.id;
        data.problem_id = problem_id;
        data.content = converter.makeHtml(data.content);

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

    async function sendReply(e, index) {
        const formData = new FormData(e.target);
        e.target.reset();
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
    textarea{
        transition: all 0.15s ease-in-out;
        color: #4D4D4D;
    }

    textarea:focus {
        outline: 0;
        border-color: #5584EB;
        box-shadow: inset 0 0 0 0.1rem #5584EB;
    }

</style>

<div class="mt3 br3 bg-near-white">

    <div class="lh-title f6 fw5 pa2 black-60">Questions</div>

    {#if questions.length > 0}

        <div classs="lh-copy w-100">
            {#each questions as question, i (question.id)}
                <div class="f7 fw5 ph2 pb2">
                    <div class="black-60">{@html sanitizeHtml(question.content)}</div>
                    {#if question.replies && question.replies.length > 0}
                        {#each question.replies as reply}
                            <div class="black-40">{@html sanitizeHtml(reply.content)}</div>
                        {/each}
                    {/if}
                    {#if isAdmin}           
                        <form on:submit|preventDefault={(e) => sendReply(e, i)}>
                            <textarea name="content" placeholder="Add a markdown-formatted reply..." class="input-reset br2 ba b--black-20 pa2 mb2 w-100"></textarea>
                            <input name="question_id" type="hidden" value={question.id}/>
                            <Button type="submit" size="small" fullwidth>Add Reply</Button>
                        </form>
                    {/if}
                </div>
            {/each}
        </div>

    {:else}

        <div class="lh-copy pv3 v-mid cf black-40 bg-near-white tc">
            <p class="f6 fw4">No Questions</p>
        </div>

    {/if}
</div>

<div class="pa2 f7 ">
    <form on:submit|preventDefault={sendQuestion}>
        <textarea name="content" placeholder="Ask a markdown-formatted question..." class="input-reset br2 ba b--black-20 pa2 mb2 w-100"/>
        <Button type="submit" size="small" fullwidth>Submit Question</Button>
    </form>
</div>
    
