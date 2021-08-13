<script>
    export let letterVars = [];
    export let interpretation = {};

    function updateTCell(letterVar, value, e){
        interpretation[letterVar] = value;
        e.target.parentElement.style.display = 'none';
        e.target.parentElement.classList.add("t_table-clicked");
        e.target.parentElement.parentElement.firstChild.style.display = 'block';
    }

    function handleMouseEnter(e){
        e.target.firstChild.style.display = 'none';
        if(e.target.lastElementChild.classList.contains('t_table-clicked')){
            e.target.lastElementChild.style.display  = 'block';
        }
    }
    
    function handleMouseLeave(e){
        e.target.firstChild.style.display = 'block';
        if(e.target.lastElementChild.classList.contains('t_table-clicked')){
            e.target.lastElementChild.style.display  = 'none';
        }
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
        display:table-cell;
        min-width:66px;
    }

    /* Jackson fixing spacing issues */
    td, tr{
        box-sizing: content-box;
    }

</style>

<div>
    <table class="t_table">
        <tr>
        {#each letterVars as letter }
                <td>{letter}</td>
        {/each}
        </tr>
        <tr>
        {#each letterVars as letterVar, index}
            <td class="t_table-space" on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave}>
                <div class="t_table-fill">
                {#if interpretation[letterVar] === true}
                    ⊤
                {:else if interpretation[letterVar] === false}
                    ⊥
                {/if}
                </div>
                <div class="t_table-buttons">
                    <div class="t_table-button_T br1" on:click={(e) => updateTCell(letterVar, true, e)}>⊤</div>
                    <div class="t_table-button_F br1" on:click={(e) => updateTCell(letterVar, false, e)}>⊥</div>
                </div>
            </td>
        {/each}
        </tr>
    </table>
</div>