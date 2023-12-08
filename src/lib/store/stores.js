import { writable } from 'svelte/store';

export const mqttStatus = writable(0);
export const sensor = writable({
    lengas1:'0',
    lengas2:'0',
    lengas3:'0',
    lengas4:'0',
});

export const lengas1 = writable('0')
 