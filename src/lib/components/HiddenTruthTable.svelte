<script>
    import {getLetterVars} from '$lib/logic.js';
    import TruthTableInput from '$lib/components/TruthTableInput.svelte';

    export let logStr;

    let tTableData = {
        logStr: logStr,
        logSubStrs: [],
        letterVars: getLetterVars(logStr),

        tAssignmentRows: [],
        tAnswerRows: [],
    };
    
    let showTruthTable = false;
    function toggleTruthTable(){
        showTruthTable = showTruthTable ? false : true;
    }  
</script>

<style>
    .show_t_table{
        text-align:center;
        color:#ccc;
    }

    .show_t_table:hover{
        color:black;
        cursor:pointer;
    }

    .show_t_table_wrapper{
        border:1px solid #ccc;
        background-color: #fbfbfb;
        padding:10px;
        margin: 2rem;
    }
</style>


<div class="show_t_table_wrapper br1">
    <a class="show_t_table" on:click={toggleTruthTable}>{showTruthTable ? 'Hide' : 'Show'} Truth Table</a>
    
    {#if showTruthTable}
        <TruthTableInput bind:tTableData={tTableData} />
    {/if}
</div>