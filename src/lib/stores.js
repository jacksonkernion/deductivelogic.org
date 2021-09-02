import { writable } from 'svelte/store';

export const courses = writable([]);
export const problemSets = writable([]);
export const symbols = writable({
    andSymbol: '.',
    orSymbol: '∨',
    notSymbol: '–',
    conditionalSymbol: '⊃',
    biconditionalSymbol: '≡',
    andShortcuts: ['.'],
    orShortcuts: ['v'],
    notShortcuts: ['-'],
    conditionalShortcuts: ['>'],
    biconditionalShortcuts: ['<>']
});