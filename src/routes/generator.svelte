<script>

    let problemForm;

    function showProblemForm(e){
        //Add a LOADING spinner?
        var problemType = e.target.value;
        
    }

</script>

<div class='add_label'>Problem Type</div>
<!-- svelte-ignore a11y-no-onchange -->
<select name="problemType" on:change={showProblemForm}>
    <option value="none"></option>
    <option value="truthTable">(TF) Truth Table</option>
    <option value="paraphrase">(TF) Paraphrase</option>
    <option value="validity">(TF) Validity</option>
    <option value="implication">(TF) Implication</option>
    <option value="implicationSet">(TF) Set of Implications</option>
    <option value="equivalence">(TF) Equivalence</option>
    <option value="equivalenceSet">(TF) Set of Equivalencies</option>
    <option value="disjNormForm">(TF) Disjunctive Normal Form</option>
    <option value="natLangImpSet">(TF) Implications in English</option>
    <option value="natLangArg">(TF) Arguments in English</option>
</select>

<div>

</div>