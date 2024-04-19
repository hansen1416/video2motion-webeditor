import { writable } from 'svelte/store';
import WebStorage from './lib/WebStorage';

export const display_scene = writable(WebStorage.read("display_scene") || "mesh");

export const control_type = writable(WebStorage.read("control_type") || "rotation");