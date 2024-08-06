import { writable } from 'svelte/store';
import { persisted } from 'svelte-persisted-store'

export const firtLoad = writable(true)
export const demoMode =writable(true)
export const runMode = writable(0); //0 = menunggu,1 penyiraman,2 pestisida,3 biopestisida
export const conect_status = writable(false)
export const loginStatus = writable(false)
export const ble_connected = writable(false)

export const mqttStatus = writable(0);
export const lengas1 = writable(0);
export const lengas2 = writable(0);
export const lengas3 = writable(0);
export const lengas4 = writable(0);

export const lengas1raw = writable('0');
export const lengas2raw = writable('0');
export const lengas3raw = writable('0');
export const lengas4raw = writable('0');

export const suhuUdara = writable(0);
export const kelembabanUdara = writable(0);
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
export const volumeAir = writable("0.00 ltr")
export const jadwalSiram =writable(" ")
export const newJadwalSiram = writable(false)
export const durasiManual = writable(5)
export const siramCount = writable("00:00")


//biopest
export const dosisAirBiopest = writable(1)
export const dosisBiopest = writable(1)
export const lahan1Biopest_status = writable(false)
export const lahan2Biopest_status = writable(false)
export const lahan3Biopest_status = writable(false)
export const lahan4Biopest_status = writable(false)
export const biopest_status = writable(false)
export const volumeSemprotBiopest = writable(0)
export const jadwalBiopest=writable(" ")
export const newJadwalBiopest = writable(false)
export const kalibrasiBiopest = writable(10)
export const kalibrasiAirBiopest = writable(10)

//pestisida
export const dosisAirPestisida = writable(1)
export const dosisPestisida = writable(1)
export const lahan1Pestisida_status = writable(false)
export const lahan2Pestisida_status = writable(false)
export const lahan3Pestisida_status = writable(false)
export const lahan4Pestisida_status = writable(false)
export const pestisida_status = writable(false)
export const volumeSemprotPestisida = writable(0)
export const kalibrasiPestisida = writable(10)
export const kalibrasiAirPestisida = writable(10)
export const jadwalPestisida =writable(" ")
export const newJadwalPestisida = writable(false)

export function resetAllValue() {
    mqttStatus.set(0);
    //lengas1.set(0)
    //lengas2.set(0)
    //lengas3.set(0)
    //lengas4.set(0)
    //suhuUdara.set(0)
    //kelembabanUdara.set(0)
    sensorFlowPestisida.set(0)
    sensorFlowBiopest.set(0)
    sensorFlowAir.set(0)

    //siram var
    //useLengas.set(false)
    //ambangLengas.set(60)
    lahan1_status.set(false)
    lahan2_status.set(false)
    lahan3_status.set(false)
    lahan4_status.set(false)
    siram_status.set(false)
    volumeAir.set(0)


    //pestisida
    //dosisAirBiopest.set(1)
    //dosisBiopest.set(1)
    lahan1Biopest_status.set(false)
    lahan2Biopest_status.set(false)
    lahan3Biopest_status.set(false)
    lahan4Biopest_status.set(false)
    biopest_status.set(false)
    volumeSemprotBiopest.set(0)

    //biopest
    //dosisAirPestisida.set(1)
    //dosisPestisida.set(1)
    lahan1Pestisida_status.set(false)
    lahan2Pestisida_status.set(false)
    lahan3Pestisida_status.set(false)
    lahan4Pestisida_status.set(false)
    pestisida_status.set(false)
    volumeSemprotPestisida.set(0)

}

export const kontrolIDStore = persisted("kontrolID","SP0000");
export const clientIDStore = persisted("clientID","-");
export const brokerUseStore = persisted("brokerUse","mqtt.eclipseprojects.io");//0= eclipse
export const brokerPortUseStore = persisted("brokerPortUse","443");//0= eclipse
export const wifiSSIDStore = writable('---');
export const wifiPasswordStore =writable('xxxx');
