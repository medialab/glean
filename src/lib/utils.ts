// Client-side utility functions
import { writable } from 'svelte/store';

export let colorMode = writable<'light' | 'dark'>('light');

export const isHomeRoute = (routeId: string | null | undefined): boolean => routeId === '/';
