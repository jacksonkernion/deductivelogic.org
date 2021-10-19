<script>
    import Problem from '$lib/components/Problem.svelte';
    import AddProblem from "$lib/components/AddProblem.svelte";
    import { problems } from '$lib/stores.js';

    $problems = [
        {
            "number": 1,
            "type": 'truthTable',
            "question": null,
            "answer": null,
            "logStr": "p | r <> q | r",
            "logStr1": null,
            "logStr2": null,
            "logStrSet": null,
            "sentSet": null
        },
        {
            "number": 2,
            "type": 'truthTable',
            "question": null,
            "answer": null,
            "logStr": "-p | q <> (p > r)",
            "logStr1": null,
            "logStr2": null,
            "logStrSet": null,
            "sentSet": null
        },
        {
            "number": 3,
            "type": "paraphrase",
            "sent": "If Serbia is forced to submit, then Austria-Hungary will control the Balkans and threaten Constantinople if and only if England does not intervene.",
            "answer": null,
            "logStr": "p > (q . r <> -s)",
            "logStr1": null,
            "logStr2": null,
            "logStrSet": null,
            "sentSet": null
        },
        {
            "number": 4,
            "type": "implication",
            "question": null,
            "answer": null,
            "logStr": null,
            "logStr1": "p <> q <> r",
            "logStr2": "p . -q | -p . r",
            "logStrSet": null,
            "sentSet": null
        },
        {
            "number": 5,
            "type": "equivalence",
            "question": null,
            "answer": null,
            "logStr": null,
            "logStr1": "p <> q <> r",
            "logStr2": "p . q . r | -p . -q . -r",
            "logStrSet": null,
            "sentSet": null
        },
        {
            "number": 6,
            "type": "disjNormForm",
            "question": null,
            "answer": null,
            "logStr": "(p <> q) . (q <> r)",
            "logStr1": null,
            "logStr2": null,
            "logStrSet": null,
            "sentSet": null
        },
        {
            "number": 7,
            "type": "natLangArg",
            "sent": "Therefore, Smith was the murderer.",
            "answer": null,
            "logStr": "q",
            "logStr1": null,
            "logStr2": null,
            "logStrSet": ["-p > q | r", "-q > -p . s","s > q | r"],
            "sentSet": ["If Jones did not meet Smith last night, then either Smith was the murderer or Jones is lying.","If Smith wasn't the murderer, then Jones did not meet Smith last night and the murder took place after midnight.","If the murder took place after midnight, then either Smith was the murderer or Jones is lying."]
        },
        {
            "number": 8,
            "type": "quantParaphrase",
            "sent": "There are sopranos who respect only those tenors who are louder than they.",
            "answer": null,
            "logStr": "(Ex)(Sx . (Ay)(Ty . Rxy > Lyx))",
            "logStr1": null,
            "logStr2": null,
            "logStrSet": null,
            "sentSet": ['S = "(1) is a soprano"','T = "(1) is a tenor"','L = "(1) is louder than (2)"','R = "(1) respects (2)"']
        },
        {
            "number": 9,
            "type": "quantInterp",
            "question": null,
            "answer": null,
            "logStr": "(Ax)(Fx > (Gx <> Hx)) . -(Ax)(Fx . Gx <> Hx) . (Ex)Fx",
            "logStr1": null,
            "logStr2": null,
            "logStrSet": null,
            "sentSet": 'true'
        },
        {
            "number": 10,
            "type": "quantInterp",
            "question": null,
            "answer": null,
            "logStr": "(Ax)(Ay)(Fxy > (Ez)(Fxz . Fyz))",
            "logStr1": null,
            "logStr2": null,
            "logStrSet": null,
            "sentSet": 'true/false'
        },    

    ];

</script>

<div class="bg-near-white bb b--black-10 relative top--1">

    <div class="mw7 center pa4">
        <p class="lh-copy f3 fw4 mv4">Interactive problem sets for deductive logic courses.<br/>Developed for Harvard's introductory course.</p>
        <p class="ttu lh-title f6 fw6 tracked ma0 mt3 pb1">Example problems below</p>
        <p class="lh-copy f4 fw4 ma0 black-60">Truth table, truth-functional paraphrase, implication, disjunctive normal form, natural language argument, quantificational paraphrase, quantificational interpretation.</p>
        <p class="ttu lh-title f6 fw6 tracked ma0 mt3 pb1">In progress</p>
        <p class="lh-copy f4 fw4 ma0 black-60">Deduction problems.</p>
    </div>

</div>

<div class="mw7 center ph4 pt4 pb6">
    <ul class="list pl0"> 
        {#each $problems as problem, i}
            <Problem {problem} number={i + 1} isAdmin={false}/>
        {/each}
    </ul>

    <AddProblem mode="welcome"/>

</div>





