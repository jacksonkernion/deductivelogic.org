import { writable } from 'svelte/store';

export let courses = writable([]);
export let problemSets = writable([]);