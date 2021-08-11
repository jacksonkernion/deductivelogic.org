<script>

    export let number;
    export let submission = {
        verdict: '',
        message: '',
    };

    function logSubmission(verdict, message){
        submission.verdict = verdict;
        submission.message = message;
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

<div class="relative pv3 w-75">
    <div class="absolute left--2"><p>{number}.</p></div>
    <slot name="description"></slot>
    <!-- <div class="bb b--black-10 "></div> -->
    <div class="submission-input"><slot name="submission-input"></slot></div>
    
    <div class="tc mt4">
        <button class="f6 br1 ba ph3 pv2 mb2 black" on:click>Check</button>
    </div>
    {#if submission.verdict}
        <!-- This is the styling for a 'solid' submission message box. Thought it to distracting/loud -->
        <!-- <div class="ph3 pv3 mt4 ba br2 b--{color} bg-washed-{color}"> -->
        <div class="ph3 pv3 tc">
            {#if submission.verdict == 'warn'}
                <ion-icon name="warning" class="dib v-mid gold"></ion-icon>
            {:else if submission.verdict == 'incorrect'}
                <ion-icon name="close-circle" class="dib v-mid red"></ion-icon>
            {:else if submission.verdict == 'correct'}
                <ion-icon name="checkbox" class="dib v-mid green"></ion-icon>
            {/if}
            <div class="dib v-mid black-70">{@html submission.message}</div>
        </div>
    {/if}
</div>
<div class="divider w-75"></div>

<style>
    ion-icon {
        font-size: 20px;
    }
</style>