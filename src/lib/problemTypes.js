export const problemTypes = {
    tTable: {
        description: "(TF) Truth Table",
        attributes: {
            logStr: "Enter the schema you'd like to test:"
        }
    },
    paraphrase: {
        description: "(TF) Paraphrase",
        attributes: {
            sent: "English sentence:",
            logStr: "Correct schematization:"
        }
    },
    validity: {
        description: "(TF) Validity",
        attributes: {
            logStr: "The candidate schema:"
        }
    },
    implication: {
        description: "(TF) Implication",
        attributes: {
            logStr1: "The candidate <i>implicating</i> schema:",
            logStr2: "The candidate <i>implicated</i> schema:"
        }
    },
    implicationSet: {
        description: "(TF) Set of Implications",
        attributes: {
            logStrSet: "Enter all the schemata which you would like to test"
        }
    },
    equivalence: {
        description: "(TF) Equivalence",
        attributes: {
            logStr1: "Enter schema (1):",
            logStr2: "Enter schema (2):"
        }
    },
    equivalenceSet: {
        description: "(TF) Set of Equivalencies",
        attributes: {
            logStr: "The master schema:",
            logStrSet: "All candidate schemata:"
        }
    },
    disjNormForm: {
        description: "(TF) Disjunctive Normal Form",
        attributes: {
            logStr: "Schema to be transformed into disjunctive normal form:"
        }
    },
    natLangImpSet: {
        description: "(TF) Implications in English",
        attributes: {
            sentSet: "All candidate English sentences:",
            logStrSet: "Each candidate sentence schematized:"
        }
    },
    natLangArg: {
        description: "(TF) Arguments in English",
        attributes: {
            sentSet: "The English premises:",
            sent: "The English conclusion:",
            logStrSet: "The schematized premises:",
            logStr: "The schematized conclusion:"
        }
    },
    quantParaphrase: {
        description: "(Quant) Paraphrase",
        attributes: {
            sent: "English sentence:",
            logStr: "Correct schematization:",
            sentSet: "Specify each predicate letter (Ex. F = \"(1) loves (2)\"):"
        }
    },
    quantInterp: {
        description: "(Quant) Interpretations",
        attributes: {
            logStr: "The schema to be interpretted:",
            interpsRequested: "Interpretations to be asked for:"
        }
    },
    multipleChoice: {
        description: "Multiple Choice",
        attributes: {
            question: "Question:",
            answer: "Answer:",
            sentSet: "Other (incorrect) choices:"
        }
    }
};


    /* deduction: {
        logStrSet_opt: "The schematized premises:",
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