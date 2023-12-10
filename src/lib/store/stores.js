import { writable } from 'svelte/store';

export const mqttStatus = writable(0);
export const lengas1 = writable('0');
export const lengas2 = writable('0');
export const lengas3 = writable('0');
export const lengas4 = writable('0');
export const suhuUdara = writable('0');
export const kelembabanUdara = writable('0');
export const sensorFlowPestisida = writable(0);
export const sensorFlowBiopest = writable(0);
export const sensorFlowAir = writable(0);

//siram var
export const useLengas = writable(false)
export const ambangLengas = writable(60)
export const lahan1_status = writable(false)
export const lahan2_status = writable(false)
export const lahan3_status = writable(false)
export const lahan4_status = writable(false)
export const siram_status = writable(false)
export const volumeAir = writable(0)

//pestisida
export const dosisAirBiopest = writable(1)
export const dosisBiopest = writable(1)
export const lahan1Biopest_status = writable(false)
export const lahan2Biopest_status = writable(false)
export const lahan3Biopest_status = writable(false)
export const lahan4Biopest_status = writable(false)
export const biopest_status = writable(false)
export const volumeSemprotBiopest = writable(0)

//biopest
export const dosisAirPestisida = writable(1)
export const dosisPestisida = writable(1)
export const lahan1Pestisida_status = writable(false)
export const lahan2Pestisida_status = writable(false)
export const lahan3Pestisida_status = writable(false)
export const lahan4Pestisida_status = writable(false)
export const pestisida_status = writable(false)
export const volumeSemprotPestisida = writable(0)

