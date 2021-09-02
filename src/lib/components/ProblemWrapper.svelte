<script>

    import { fly } from 'svelte/transition';

    export let number;
    export let submission = {
        verdict: '',
        message: '',
        number: 1
    };

    function logSubmission(verdict, message){
        submission.verdict = verdict;
        submission.message = message;
        submission.number++;
    }

    submission.log = logSubmission;

    let color = '';
    //let icon = '';
    //let iconColor = '';

    $: {
        if(submission.verdict == 'warn'){
            color = 'yellow';
            //icon = 'warning';
            //iconColor = 'gold';
        }
        if(submission.verdict == 'incorrect'){
            color = 'red';
            //icon = 'close-circle';
            //iconColor = 'red';
        }
        if(submission.verdict == 'correct'){
            color = 'green';
            //icon = 'checkbox';
            //iconColor = 'green';
        }
    }

    /*
    let isCorrect = submission.verdict == 'correct' ? true : false;

    let bgColor = isCorrect ? 'washed-green' : 'washed-red';
    let borderColor = isCorrect ? 'green' : 'red';
    */

</script>

<style>

    .submission-input{

    }

    .submission-message{
        max-width: 26rem;
        padding: .125rem;
    }
    .submission-message-wrapper{
        padding-top:  .4rem;
    }

</style>

<div class="relative pv3 w-75">
    <div class="absolute left--2 lh-copy"><p>{number}.</p></div>
    <div class="lh-copy">
        <slot name="description"></slot>
    </div>
    <!-- <div class="bb b--black-10 "></div> -->
    <div class="submission-input"><slot name="submission-input"></slot></div>
    
    <div class="mt4 mb2 cf">
        {#key submission.number}
            <!-- This is the styling for a 'solid' submission message box. Thought it to distracting/loud -->
            <!-- <div class="ph3 pv3 mt4 ba br2 b--{color} bg-washed-{color}"> -->
            <div class="fl submission-message-wrapper" in:fly={{ y: -30 }}>
                {#if submission.verdict == 'warn'}
                    <ion-icon name="warning" class="dib v-mid gold"></ion-icon>
                {:else if submission.verdict == 'incorrect'}
                    <ion-icon name="close-circle" class="dib v-mid red"></ion-icon>
                {:else if submission.verdict == 'correct'}
                    <ion-icon name="checkbox" class="dib v-mid green"></ion-icon>
                {/if}
                <div class="submission-message dib v-mid black-70 f6">{@html submission.message}</div>
            </div>
        {/key}
        <button class="f6 br1 ba ph3 pv2 black fr" on:click>Check</button>
    </div>
</div>
<div class="divider w-75"></div>