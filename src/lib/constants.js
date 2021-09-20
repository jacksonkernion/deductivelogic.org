export const problemTypes = {
    truthTable: {
        description: "(TF) Truth Table",
        attributes: {
            logStr: "Schema to test"
        }
    },
    paraphrase: {
        description: "(TF) Paraphrase",
        attributes: {
            sent: "English sentence",
            logStr: "Schematized sentence"
        }
    },
    validity: {
        description: "(TF) Validity",
        attributes: {
            logStr: "Candidate schema"
        }
    },
    implication: {
        description: "(TF) Implication",
        attributes: {
            logStr1: "Candidate <em>implicating</em> schema",
            logStr2: "Candidate <em>implicated</em> schema"
        }
    },
    implicationSet: {
        description: "(TF) Set of Implications",
        attributes: {
            logStrSet: "Schemata to test"
        }
    },
    equivalence: {
        description: "(TF) Equivalence",
        attributes: {
            logStr1: "Schema (1)",
            logStr2: "Schema (2):"
        }
    },
    equivalenceSet: {
        description: "(TF) Set of Equivalencies",
        attributes: {
            logStr: "Master schema",
            logStrSet: "Candidate schemata"
        }
    },
    disjNormForm: {
        description: "(TF) Disjunctive Normal Form",
        attributes: {
            logStr: "Schema to be transformed into disjunctive normal form"
        }
    },
    natLangImpSet: {
        description: "(TF) Implications in English",
        attributes: {
            sentSet: "Candidate English sentences",
            logStrSet: "Each candidate sentence, schematized"
        }
    },
    natLangArg: {
        description: "(TF) Arguments in English",
        attributes: {
            sentSet: "English premises",
            sent: "English conclusion",
            logStrSet: "Schematized premises",
            logStr: "Schematized conclusion"
        }
    },
    quantParaphrase: {
        description: "(Quant) Paraphrase",
        attributes: {
            sent: "English sentence",
            logStr: "Schematized sentence",
            sentSet: "Predicate specification <span class='normal black-60'>(Ex. Fxy = \"x loves y\")</span>",
        }
    },
    quantInterp: {
        description: "(Quant) Interpretations",
        attributes: {
            logStr: "Schema to be interpretted",
            sentSet: "Interpretations to ask for"
        }
    },
    multipleChoice: {
        description: "Multiple Choice",
        attributes: {
            sent: "Question",
            answer: "Answer",
            sentSet: "Other (incorrect) choices"
        }
    }
};


    /* deduction: {
        logStrSet: "The schematized premises:",
        logStr: "The schematized conclusion:"
    }, */

        
    /*
    fillBlanks: {
        question: "Sentence with blanks - (Place a SINGLE \"_\" wherever you'd like the students to fill in a blank):",
        sentSet: "The correct 'fills' for each blank, in order of occurence in the sentence:"
    },
    free_response: {
        question: "Question:"
    },
    punctuation: {
        question: "Incorrectly-punctuated sentence:",
        answer: "Correctly-puntuated sentence:"
    },
    q_and_a: {
        question: "Question:",
        answer: "Answer:"
    },
    */