<script>
    import {dispLogStr} from '$lib/helpers.js';

    export let tTableData = {
        logStr: '',
        logSubStrs: [],
        letterVars: [],

        tAssignmentRows: [],
        tAnswerRows: [],
    };

    let highlightT = false;
    let highlightF = false;

    for(let i=0; i < Math.pow(2, tTableData.letterVars.length); i++){

        let tAssignmentRow = [];
        let tAnswerRow = [null]; //add toAnswerRows, for logSubStrs

        //A left-padded binary string, representing the i-th row of truth table
        let truthValues = i.toString(2).padStart(tTableData.letterVars.length, '0');
        for(let j=0; j < tTableData.letterVars.length; j++){
            if(truthValues[j] == 0)
                tAssignmentRow.push(true);
            else
                tAssignmentRow.push(false);
        }
        tTableData.tAssignmentRows = [...tTableData.tAssignmentRows, tAssignmentRow];

        /*for(let j=0; j < toAnswerArray.length; j++){
            answerRow[j] = null;
        } */

        tTableData.tAnswerRows = [...tTableData.tAnswerRows, tAnswerRow];
    }

    function updateTCell(rowIndex, cellIndex, value, e){
        tTableData.tAnswerRows[rowIndex][cellIndex] = value;
        e.target.parentElement.style.display = 'none';
        e.target.parentElement.classList.add("t_table-clicked");
        e.target.parentElement.parentElement.firstChild.style.display = 'block';
    }

    function handleMouseEnter(e){
        e.target.firstChild.style.display = 'none';
        if(e.target.lastChild.classList.contains('t_table-clicked')){
            e.target.lastChild.style.display  = 'block';
        }
    }
    
    function handleMouseLeave(e){
        e.target.firstChild.style.display = 'block';
        if(e.target.lastChild.classList.contains('t_table-clicked')){
            e.target.lastChild.style.display  = 'none';
        }
    }

    function toggleHighlightT(){
        highlightT = highlightT ? false : true;
    }
    function toggleHighlightF(){
        highlightF = highlightF ? false : true;
    }

</script>

<style>

    table, tr, td {
        border-collapse:collapse;
        border:1px solid #ccc;
        text-align:center;
        padding:5px 10px;
        font-size:16px;
        line-height: 1;
    }

    .t_table{
        margin:0 auto;
        background-color:white;
        color:black;
    }

    .t_table-buttons{
        margin:0 auto;
        width:66px;
    }

    .t_table-highlight_F:hover, .t_table-highlight_T:hover, .t_table-clear_all:hover{
        cursor:pointer;
        border:1px solid black;
        color:black;
    }

    .t_table-button_F, .t_table-button_T{
        float:left;
        padding:4px 6px 3px 6px;
        border:1px solid #ccc;
        color:#ccc;
        margin:0px 3px;
        font-family: arial, sans-serif;
        box-sizing: content-box;
    }

    .t_table-button_F:hover, .t_table-button_T:hover{
        cursor:pointer;
        border:1px solid black;
        color:black;
    }

    .t_table-fill{
        min-width:66px;
    }

    .t_table-space{
        padding:3px 0px;
        margin:0px;
        height:25px;
        min-width:66px;
    }

    .t_table-space.log_str_parent-1{
        display:table-cell;
    }

    .t_table-top_row{
        background-color:#eeeeee;
    }

    .t_table-toolbar{
        display: block;
        height: 80px;
        width: 165px;
        padding: 15px;
    }

    .t_table-clear_all{
        float:left;
        padding:5px 6px;
        color:#ccc;
        margin:3px 3px 0px 3px;
        font-size:13px;
        background-color:white;
        border: 1px solid #ccc;
        color: #ccc;
        text-align: center;
    }

    .t_table-highlight{
        color:#aaa;
        font-size:10px;
        padding-left: 3px;
        font-weight: 500;
    }

    .t_table-highlight_F, .t_table-highlight_T{
        float:left;
        border:1px solid #ccc;
        color:#ccc;
        margin:3px 3px 0px 3px;
        background-color:white;
        padding:3px 6px;
        box-sizing: content-box;
    }

    .highlightT, .highlightF{
        background-color:#eeeeee;
    }

    /* Jackson fixing spacing issues */
    td, tr{
        box-sizing: content-box;
    }

</style>

<div class="t_table-toolbar mw5 center">
    <div class="t_table-highlight tracked tl">HIGHLIGHT</div>
    <div class="t_table-highlight_T br1" class:highlightT on:click={toggleHighlightT}>⊤</div>
    <div class="t_table-highlight_F br1" class:highlightF on:click={toggleHighlightF}>⊥</div>
    <div class="t_table-clear_all br1">Clear all</div>
</div>
<table class="t_table">
    <tr class="t_table-top_row">
        {#each tTableData.letterVars as letterVar}
        <td>{letterVar}</td>
        {/each}
        <td>{dispLogStr(tTableData.logStr)}</td>
    </tr>

    {#each tTableData.tAssignmentRows as tAssignmentRow, rowIndex}
        <tr class="t_table-body_row">
            {#each tAssignmentRow as tAssignment}
                {#if tAssignment}
                    <td class:highlightT>⊤</td>
                {:else}
                    <td class:highlightF>⊥</td>
                {/if}
            {/each}
            {#each tTableData.tAnswerRows[rowIndex] as tAnswerCell, cellIndex}
                <td class="t_table-space" class:highlightT="{highlightT && tAnswerCell}" class:highlightF="{highlightF && tAnswerCell === false}" on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave}>
                    <div class="t_table-fill">
                    {#if tAnswerCell === true}
                        ⊤
                    {:else if tAnswerCell === false}
                        ⊥
                    {/if}
                    </div>
                    <div class="t_table-buttons">
                        <div class="t_table-button_T br1" on:click={(e) => updateTCell(rowIndex, cellIndex, true, e)}>⊤</div>
                        <div class="t_table-button_F br1" on:click={(e) => updateTCell(rowIndex, cellIndex, false, e)}>⊥</div>
                    </div>
                </td>
            {/each}
        </tr>
    {/each}

</table>