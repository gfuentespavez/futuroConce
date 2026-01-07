import { writable } from 'svelte/store';

export const annotations = writable([]);
export const showPostIt = writable(false);
export const selectedLocation = writable(null);
export const totalCount = writable(0);

// Categorías con sus colores
export const categories = [
    { name: 'problema', color: '#ff6b6b', label: 'Problema' },
    { name: 'propuesta', color: '#4ecdc4', label: 'Propuesta' },
    { name: 'observacion', color: '#ffeb3b', label: 'Observación' },
    { name: 'pregunta', color: '#95a5f5', label: 'Pregunta' }
];