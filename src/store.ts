import { writable } from 'svelte/store';
import WebStorage from './lib/WebStorage';
import * as THREE from 'three';

export const display_scene = writable(WebStorage.read("display_scene") || "mesh");

export const control_type = writable(WebStorage.read("control_type") || "rotation");

export const currentRotation = writable(new THREE.Euler(0, 0, 0));