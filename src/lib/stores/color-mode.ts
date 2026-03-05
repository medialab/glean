import { writable } from 'svelte/store';

export const colorMode = writable<'light' | 'dark'>('light');
