<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { kirimMsg } from '$lib/mqttHandle';
	
	import {
		dosisPestisida,
		dosisAirPestisida,
		lahan1Pestisida_status,
		lahan2Pestisida_status,
		lahan3Pestisida_status,
		lahan4Pestisida_status,
		pestisida_status,
		firtLoad,
		jadwalPestisida,
		newJadwalPestisida,
		volumeAir,
		runMode,
		resetAllValue,
		demoMode,
		conect_status,
		kontrolIDStore,
		ble_connected
	} from '$lib/store/stores';
	import Modal from '$lib/Modal.svelte';
	import SveltyPicker from 'svelty-picker';
	import { get } from 'svelte/store';

	let showjadwal = 0;
	let showMode = 0;
	let dosisAirPestisida1 = 1;
	let dosisPestisida1 = 1;
	let dosisAirPestisida2 = 1;
	let dosisPestisida2 = 1;
	let dosisAirPestisida3 = 1;
	let dosisPestisida3 = 1;
	let dosisAirPestisida4 = 1;
	let dosisPestisida4 = 1;
	let dosisAirPestisida5 = 1;
	let dosisPestisida5 = 1;

	let jadwal1Enable = false;
	let jadwal2Enable = false;
	let jadwal3Enable = false;
	let jadwal4Enable = false;
	let jadwal5Enable = false;
	let waktuSemprot1 = '06:00';
	let waktuSemprot2 = '06:00';
	let waktuSemprot3 = '06:00';
	let waktuSemprot4 = '06:00';
	let waktuSemprot5 = '06:00';

	let hari = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
	let lahan = ['Lahan 1', 'Lahan 2', 'Lahan 3', 'Lahan 4'];
	let pilihanHari1 = [0, 0, 0, 0, 0, 0, 0];
	let pilihanHari2 = [0, 0, 0, 0, 0, 0, 0];
	let pilihanHari3 = [0, 0, 0, 0, 0, 0, 0];
	let pilihanHari4 = [0, 0, 0, 0, 0, 0, 0];
	let pilihanHari5 = [0, 0, 0, 0, 0, 0, 0];
	let cekHari1 = [false, false, false, false, false, false, false];
	let cekHari2 = [false, false, false, false, false, false, false];
	let cekHari3 = [false, false, false, false, false, false, false];
	let cekHari4 = [false, false, false, false, false, false, false];
	let cekHari5 = [false, false, false, false, false, false, false];

	let pilihanLahan1 = [0, 0, 0, 0];
	let pilihanLahan2 = [0, 0, 0, 0];
	let pilihanLahan3 = [0, 0, 0, 0];
	let pilihanLahan4 = [0, 0, 0, 0];
	let pilihanLahan5 = [0, 0, 0, 0];
	let cekLahan1 = [false, false, false, false];
	let cekLahan2 = [false, false, false, false];
	let cekLahan3 = [false, false, false, false];
	let cekLahan4 = [false, false, false, false];
	let cekLahan5 = [false, false, false, false];

	let showModal = false;
	let alertType = 0;
	let timeOut = 0;

	onMount(() => {
		resetAllValue();
		if ($firtLoad) {
			goto('/');
		}
		//loadJadwalPestisida()
		getAllStatus();
		setTimeout(loadJadwalPestisida, 1000);
		showjadwal = 0;
	});
	function getJadwalPestisida() {
		kirimMsg('pestisida', 0, 'getJadwal', 0);
		setTimeout(loadJadwalPestisida, 1000);
	}
	function loadJadwalPestisida() {
		if ($jadwalPestisida.length >= 200) {
			loadJadwal();
		} else {
			//default Jadwal
			console.log('load default jadwal');
			let jw =
				'0,1,0,07,00,1,1,1,1,1,1,1,1,1,1,1,0,0,5;0,2,0,11,30,1,1,1,1,1,1,1,1,1,1,1,0,0,3;0,3,0,16,00,1,1,1,1,1,1,1,1,1,1,1,0,0,5;0,2,0,11,30,1,1,1,1,1,1,1,1,1,1,1,0,0,3;0,3,0,16,00,1,1,1,1,1,1,1,1,1,1,1,0,0,5;';
			$jadwalPestisida = jw;
			loadJadwal();
		}
	}

	function getAllStatus() {
		kirimMsg('pestisida', 0, 'getStatus', '0');
	}

	function semprotPestisida(lahan) {
		let msg = '0';
		if (($conect_status) || ($ble_connected)) {
			if ($runMode === 0 || $runMode === 2) {
				runMode.set(2);
				if (lahan === 0) {
					if ($pestisida_status) {
						msg = '1';

						$lahan1Pestisida_status = true;
						$lahan2Pestisida_status = true;
						$lahan3Pestisida_status = true;
						$lahan4Pestisida_status = true;
					} else {
						msg = '0';
						$lahan1Pestisida_status = false;
						$lahan2Pestisida_status = false;
						$lahan3Pestisida_status = false;
						$lahan4Pestisida_status = false;
					}
				} else if (lahan === 1) {
					if ($lahan1Pestisida_status) {
						msg = '1';
						$pestisida_status = true;
					} else {
						msg = '0';
					}
				} else if (lahan === 2) {
					if ($lahan2Pestisida_status) {
						msg = '1';
						$pestisida_status = true;
					} else {
						msg = '0';
					}
				} else if (lahan === 3) {
					if ($lahan3Pestisida_status) {
						msg = '1';
						$pestisida_status = true;
					} else {
						msg = '0';
					}
				} else if (lahan === 4) {
					if ($lahan4Pestisida_status) {
						msg = '1';
						$pestisida_status = true;
					} else {
						msg = '0';
					}
				}
				//if (readySend) {
				if (!$demoMode) kirimMsg('pestisida', lahan, 'cmd', msg);
				else {
					alertDemo();
					$lahan1Pestisida_status = false;
					$lahan2Pestisida_status = false;
					$lahan3Pestisida_status = false;
					$lahan4Pestisida_status = false;
					$pestisida_status = false;
				}
			} else {
				//
				$lahan1Pestisida_status = false;
				$lahan2Pestisida_status = false;
				$lahan3Pestisida_status = false;
				$lahan4Pestisida_status = false;
				$pestisida_status = false;
				alertShow($runMode);
			}
		} else {
			alertConect();
			$lahan1Pestisida_status = false;
			$lahan2Pestisida_status = false;
			$lahan3Pestisida_status = false;
			$lahan4Pestisida_status = false;
			$pestisida_status = false;
		}
	}

	function alertDemo() {
		showModal = true;
		showMode = 3;
		alertType = 1;
		timeOut = 2;
	}

	function alertConect() {
		showModal = true;
		showMode = 3;
		alertType = 2;
		timeOut = 2;
	}
	function alertLahan() {
		showModal = true;
		showMode = 3;
		alertType = 3;
		timeOut = 2;
	}
	function alertHari() {
		showModal = true;
		showMode = 3;
		alertType = 4;
		timeOut = 2;
	}
	function alertSimpanJadwal() {
		showModal = true;
		showMode = 3;
		alertType = 5;
		timeOut = 2;
	}

	function alertShow(val) {
		showModal = true;
		showMode = val;
		alertType = 0;
		timeOut = 2;
	}

	function simpanDosisAirPestisida() {
		if (!$demoMode) {
			if (($conect_status) || ($ble_connected)) {
				kirimMsg('pestisida', 0, 'setDosisAirPestisida', String($dosisAirPestisida));
			} else {
				alertConect();
			}
		} else {
			alertDemo();
		}
	}
	function simpanDosisPestisida() {
		if (!$demoMode) {
			if (($conect_status) || ($ble_connected)) {
				kirimMsg('pestisida', 0, 'setDosisPestisida', String($dosisPestisida));
			} else {
				alertConect();
			}
		} else {
			alertDemo();
		}
	}

	function lahan1Click(idx) {
		if (cekLahan1[idx]) {
			pilihanLahan1[idx] = 1;
		} else {
			pilihanLahan1[idx] = 0;
		}
		//console.log(pilihanLahan1)
	}

	function lahan2Click(idx) {
		if (cekLahan2[idx]) {
			pilihanLahan2[idx] = 1;
		} else {
			pilihanLahan2[idx] = 0;
		}
		//console.log(pilihanLahan1)
	}

	function lahan3Click(idx) {
		if (cekLahan3[idx]) {
			pilihanLahan3[idx] = 1;
		} else {
			pilihanLahan3[idx] = 0;
		}
		//console.log(pilihanLahan1)
	}

	function lahan4Click(idx) {
		if (cekLahan4[idx]) {
			pilihanLahan4[idx] = 1;
		} else {
			pilihanLahan4[idx] = 0;
		}
		//console.log(pilihanLahan1)
	}

	function lahan5Click(idx) {
		if (cekLahan5[idx]) {
			pilihanLahan5[idx] = 1;
		} else {
			pilihanLahan5[idx] = 0;
		}
		//console.log(pilihanLahan1)
	}

	function pilihanHari1Click(idx) {
		if (cekHari1[idx]) {
			pilihanHari1[idx] = 1;
		} else {
			pilihanHari1[idx] = 0;
		}
	}
	function pilihanHari2Click(idx) {
		if (cekHari2[idx]) {
			pilihanHari2[idx] = 1;
		} else {
			pilihanHari2[idx] = 0;
		}
	}

	function pilihanHari3Click(idx) {
		if (cekHari3[idx]) {
			pilihanHari3[idx] = 1;
		} else {
			pilihanHari3[idx] = 0;
		}
	}

	function pilihanHari4Click(idx) {
		if (cekHari4[idx]) {
			pilihanHari4[idx] = 1;
		} else {
			pilihanHari4[idx] = 0;
		}
	}

	function pilihanHari5Click(idx) {
		if (cekHari5[idx]) {
			pilihanHari5[idx] = 1;
		} else {
			pilihanHari5[idx] = 0;
		}
	}

	function packingJadwal() {
		//format
		//enable,idx,jenis,H,M,s,s,r,k,j,s,m,l1,l2,l3,l4,A,P,T;enable,idx,jenis,H,M,s,s,r,k,j,s,m,l1,l2,l3,l4,A,P,T;enable,idx,jenis,H,M,s,s,r,k,j,s,m,l1,l2,l3,l4,A,P,T
		let jw = '';
		if (jadwal1Enable) {
			jw += '1';
		} else {
			jw += '0';
		}
		jw += ',1,1,'; //kode 1 kode pestisida
		let wt = waktuSemprot1.split(':');
		jw += wt[0];
		jw += ',';
		jw += wt[1];
		jw += ',';
		for (let i = 0; i < 7; i++) {
			jw += String(pilihanHari1[i]);
			jw += ',';
		}

		for (let i = 0; i < 4; i++) {
			jw += String(pilihanLahan1[i]);
			jw += ',';
		}
		jw += String(dosisAirPestisida1);
		jw += ',';
		jw += String(dosisPestisida1);
		jw += ',0';
		jw += ';';

		//jadwal 2
		if (jadwal2Enable) {
			jw += '1';
		} else {
			jw += '0';
		}
		jw += ',2,1,'; //kode 0 siram
		wt = waktuSemprot2.split(':');
		jw += wt[0];
		jw += ',';
		jw += wt[1];
		jw += ',';
		for (let i = 0; i < 7; i++) {
			jw += String(pilihanHari2[i]);
			jw += ',';
		}

		for (let i = 0; i < 4; i++) {
			jw += String(pilihanLahan2[i]);
			jw += ',';
		}
		jw += String(dosisAirPestisida2);
		jw += ',';
		jw += String(dosisPestisida2);
		jw += ',0';
		jw += ';';

		//jadwal 3
		if (jadwal3Enable) {
			jw += '1';
		} else {
			jw += '0';
		}
		jw += ',3,1,'; //
		wt = waktuSemprot3.split(':');
		jw += wt[0];
		jw += ',';
		jw += wt[1];
		jw += ',';
		for (let i = 0; i < 7; i++) {
			jw += String(pilihanHari3[i]);
			jw += ',';
		}

		for (let i = 0; i < 4; i++) {
			jw += String(pilihanLahan3[i]);
			jw += ',';
		}
		jw += String(dosisAirPestisida3);
		jw += ',';
		jw += String(dosisPestisida3);
		jw += ',0';
		jw += ';';

		//jadwal 4
		if (jadwal4Enable) {
			jw += '1';
		} else {
			jw += '0';
		}
		jw += ',2,1,'; //kode 0 siram
		wt = waktuSemprot4.split(':');
		jw += wt[0];
		jw += ',';
		jw += wt[1];
		jw += ',';
		for (let i = 0; i < 7; i++) {
			jw += String(pilihanHari4[i]);
			jw += ',';
		}

		for (let i = 0; i < 4; i++) {
			jw += String(pilihanLahan4[i]);
			jw += ',';
		}
		jw += String(dosisAirPestisida4);
		jw += ',';
		jw += String(dosisPestisida4);
		jw += ',0';
		jw += ';';

		//jadwal 5
		if (jadwal5Enable) {
			jw += '1';
		} else {
			jw += '0';
		}
		jw += ',2,1,'; //kode 0 siram
		wt = waktuSemprot5.split(':');
		jw += wt[0];
		jw += ',';
		jw += wt[1];
		jw += ',';
		for (let i = 0; i < 7; i++) {
			jw += String(pilihanHari5[i]);
			jw += ',';
		}

		for (let i = 0; i < 4; i++) {
			jw += String(pilihanLahan5[i]);
			jw += ',';
		}
		jw += String(dosisAirPestisida5);
		jw += ',';
		jw += String(dosisPestisida5);
		jw += ',0';
		jw += ';';
		return jw;
	}

	function simpanJadwalPestisida() {
		let simpan = false;
		if ($demoMode) {
			alertDemo();
		} else if (!$conect_status) {
			alertConect();
			jadwal1Enable = false;
			jadwal2Enable = false;
			jadwal3Enable = false;
			jadwal4Enable = false;
			jadwal5Enable = false;
		} else {
			if (showjadwal === 1) {
				if (!cekLahan1[0] && !cekLahan1[1] && !cekLahan1[2] && !cekLahan1[3]) {
					alertLahan();
				} else if (
					!cekHari1[0] &&
					!cekHari1[1] &&
					!cekHari1[2] &&
					!cekHari1[3] &&
					!cekHari1[4] &&
					!cekHari1[5] &&
					!cekHari1[6]
				) {
					alertHari();
				} else {
					simpan = true;
				}
			} else if (showjadwal === 2) {
				if (!cekLahan2[0] && !cekLahan2[1] && !cekLahan2[2] && !cekLahan2[3]) {
					alertLahan();
				} else if (
					!cekHari2[0] &&
					!cekHari2[1] &&
					!cekHari2[2] &&
					!cekHari2[3] &&
					!cekHari2[4] &&
					!cekHari2[5] &&
					!cekHari2[6]
				) {
					alertHari();
				} else {
					simpan = true;
				}
			} else if (showjadwal === 3) {
				if (!cekLahan3[0] && !cekLahan3[1] && !cekLahan3[2] && !cekLahan3[3]) {
					alertLahan();
				} else if (
					!cekHari3[0] &&
					!cekHari3[1] &&
					!cekHari3[2] &&
					!cekHari3[3] &&
					!cekHari3[4] &&
					!cekHari3[5] &&
					!cekHari3[6]
				) {
					alertHari();
				} else {
					simpan = true;
				}
			} else if (showjadwal === 4) {
				if (!cekLahan4[0] && !cekLahan4[1] && !cekLahan4[2] && !cekLahan4[3]) {
					alertLahan();
				} else if (
					!cekHari4[0] &&
					!cekHari4[1] &&
					!cekHari4[2] &&
					!cekHari4[3] &&
					!cekHari4[4] &&
					!cekHari4[5] &&
					!cekHari4[6]
				) {
					alertHari();
				} else {
					simpan = true;
				}
			} else if (showjadwal === 5) {
				if (!cekLahan5[0] && !cekLahan5[1] && !cekLahan5[2] && !cekLahan5[3]) {
					alertLahan();
				} else if (
					!cekHari5[0] &&
					!cekHari5[1] &&
					!cekHari5[2] &&
					!cekHari5[3] &&
					!cekHari5[4] &&
					!cekHari5[5] &&
					!cekHari5[6]
				) {
					alertHari();
				} else {
					simpan = true;
				}
			}
			if (simpan) {
				alertSimpanJadwal();
				showMode = 1;
				showjadwal = 0;
				let jwl = packingJadwal();
				//console.log(jwl);
				kirimMsg('pestisida', 0, 'setJadwal', jwl);
			}
		}
	}

	function loadJadwal() {
		//format
		//enable,idx,jenis,H,M,s,s,r,k,j,s,m,l1,l2,l3,l4,A,P,T;enable,idx,jenis,H,M,s,s,r,k,j,s,m,l1,l2,l3,l4,A,P,T;enable,idx,jenis,H,M,s,s,r,k,j,s,m,l1,l2,l3,l4,A,P,T

		let jadwal123 = $jadwalPestisida.split(';');
		//jadwal1
		let jadwal1 = jadwal123[0].split(',');
		if (jadwal1[0] === '1') {
			jadwal1Enable = true;
		} else {
			jadwal1Enable = false;
		}
		waktuSemprot1 = jadwal1[3] + ':';
		waktuSemprot1 += jadwal1[4];
		for (let i = 0; i < 7; i++) {
			if (jadwal1[5 + i] === '1') {
				cekHari1[i] = true;
			} else {
				cekHari1[i] = false;
			}
		}
		for (let i = 0; i < 4; i++) {
			if (jadwal1[12 + i] === '1') {
				cekLahan1[i] = true;
			} else {
				cekLahan1[i] = false;
			}
		}
		dosisAirPestisida1 = parseInt(jadwal1[16]);
		dosisPestisida1 = parseInt(jadwal1[17]);
		//durasiSiram1 = jadwal1[18];
		//jadwal2
		let jadwal2 = jadwal123[1].split(',');
		if (jadwal2[0] === '1') {
			jadwal2Enable = true;
		} else {
			jadwal2Enable = false;
		}
		waktuSemprot2 = jadwal2[3] + ':';
		waktuSemprot2 += jadwal2[4];
		for (let i = 0; i < 7; i++) {
			if (jadwal2[5 + i] === '1') {
				cekHari2[i] = true;
			} else {
				cekHari2[i] = false;
			}
		}
		for (let i = 0; i < 4; i++) {
			if (jadwal2[12 + i] === '1') {
				cekLahan2[i] = true;
			} else {
				cekLahan2[i] = false;
			}
		}
		dosisAirPestisida2 = parseInt(jadwal2[16]);
		dosisPestisida2 = parseInt(jadwal2[17]);
		//durasiSiram2 = jadwal1[18];
		//jadwal3
		let jadwal3 = jadwal123[2].split(',');
		if (jadwal3[0] === '1') {
			jadwal3Enable = true;
		} else {
			jadwal3Enable = false;
		}
		waktuSemprot3 = jadwal3[3] + ':';
		waktuSemprot3 += jadwal3[4];
		for (let i = 0; i < 7; i++) {
			if (jadwal3[5 + i] === '1') {
				cekHari3[i] = true;
			} else {
				cekHari3[i] = false;
			}
		}
		for (let i = 0; i < 4; i++) {
			if (jadwal3[12 + i] === '1') {
				cekLahan3[i] = true;
			} else {
				cekLahan3[i] = false;
			}
		}
		dosisAirPestisida3 = parseInt(jadwal3[16]);
		dosisPestisida3 = parseInt(jadwal3[17]);
		//durasiSiram3 = jadwal1[18];
		//jadwal2
		let jadwal4 = jadwal123[3].split(',');
		if (jadwal4[0] === '1') {
			jadwal4Enable = true;
		} else {
			jadwal4Enable = false;
		}
		waktuSemprot4 = jadwal4[3] + ':';
		waktuSemprot4 += jadwal4[4];
		for (let i = 0; i < 7; i++) {
			if (jadwal4[5 + i] === '1') {
				cekHari4[i] = true;
			} else {
				cekHari4[i] = false;
			}
		}
		for (let i = 0; i < 4; i++) {
			if (jadwal4[12 + i] === '1') {
				cekLahan4[i] = true;
			} else {
				cekLahan4[i] = false;
			}
		}
		dosisAirPestisida4 = parseInt(jadwal4[16]);
		dosisPestisida4 = parseInt(jadwal4[17]);
		//durasiSiram2 = jadwal1[18];
		//jadwal5
		let jadwal5 = jadwal123[4].split(',');
		if (jadwal5[0] === '1') {
			jadwal5Enable = true;
		} else {
			jadwal5Enable = false;
		}
		waktuSemprot5 = jadwal5[3] + ':';
		waktuSemprot5 += jadwal5[4];
		for (let i = 0; i < 7; i++) {
			if (jadwal5[5 + i] === '1') {
				cekHari5[i] = true;
			} else {
				cekHari5[i] = false;
			}
		}
		for (let i = 0; i < 4; i++) {
			if (jadwal5[12 + i] === '1') {
				cekLahan5[i] = true;
			} else {
				cekLahan5[i] = false;
			}
		}
		dosisAirPestisida5 = parseInt(jadwal5[16]);
		dosisPestisida5 = parseInt(jadwal5[17]);
		//durasiSiram2 = jadwal1[18];
	}

	function jadwalClick(jadwal = 1) {
		showModal = true;
		showMode = 1;
		showjadwal = jadwal;
	}

	function jadwalAktif(jadwal) {
		if ($demoMode) {
			alertDemo();
			switch (jadwal) {
				case 1:
					jadwal1Enable = false;
					break;
				case 2:
					jadwal2Enable = false;
					break;
				case 3:
					jadwal3Enable = false;
					break;
				case 4:
					jadwal4Enable = false;
					break;
				case 5:
					jadwal5Enable = false;
					break;
			}
		}
	}

	$: if ($newJadwalPestisida == true) {
		loadJadwalPestisida();
		newJadwalPestisida.set(false);
		//console.log('load new jadwal pestisida');
	}
</script>

<div class="h-screen w-screen">
	<div class="bg_pestisida h-full w-full grid justify-items-center max-w-md mx-auto flex flex-col">
		<div class="hd_pestisida1 w-full h-16">
			<div class="text-xs w-full text-center mt-12">{get(kontrolIDStore)}</div>
			<div class="w-full h-4 grid justify-items-center mb-2">
				{#if $demoMode}
					<div class="text-center text-xs bg-red-500 text-white w-12 h-4">
						<small>Demo</small>
					</div>
				{:else if $ble_connected}
					<div class="text-center text-xs bg-blue-900 text-white w-12 h-4">
						<small>Bluethoot</small>
					</div>
				{:else if $conect_status}
					<div class="text-center text-xs bg-green-500 text-white w-12 h-4">
						<small>Online</small>
					</div>
				{:else}
					<div class="text-center text-xs bg-gray-700 text-white w-12 h-4">
						<small>Offline</small>
					</div>
				{/if}
			</div>
		</div>

		<div class="w-11/12 p-1 mt-2 grid justify-items-center">
			<!--info-->
			<div
				class="w-full mt-2 p-1 grid justify-items-center rounded-lg shadow-lg border border-gray-300"
			>
				<div class="text-xs text-center">Total pestisida</div>
				<div class="text-xl font-bold">{$volumeAir} <small class="text-xs">liter</small></div>
			</div>

			<div class="grid grid-cols-5 gap-2 mt-4 h-10 w-full">
				<button
					class={jadwal1Enable
						? 'border border-gray-700 shadow-lg rounded  bg-green-700 text-white'
						: 'border border-gray-700 shadow-lg rounded   text-black'}
					on:click={() => jadwalClick(1)}
					><div class="text-xs"><small>Jadwal1</small></div>
					<div class="text-xs font-bold">{waktuSemprot1}</div>
				</button>
				<button
					class={jadwal2Enable
						? 'border border-gray-700 shadow-lg rounded   bg-green-700 text-white'
						: 'border border-gray-700 shadow-lg rounded   text-black'}
					on:click={() => jadwalClick(2)}
					><div class="text-xs"><small>Jadwal2</small></div>
					<div class="text-xs font-bold">{waktuSemprot2}</div>
				</button>
				<button
					class={jadwal3Enable
						? 'border border-gray-700 shadow-lg rounded  bg-green-700 text-white'
						: 'border border-gray-700 shadow-lg rounded   text-black'}
					on:click={() => jadwalClick(3)}
					><div class="text-xs"><small>Jadwal3</small></div>
					<div class="text-xs font-bold">{waktuSemprot3}</div>
				</button>
				<button
					class={jadwal4Enable
						? 'border border-gray-700 shadow-lg rounded  bg-green-700 text-white'
						: 'border border-gray-700 shadow-lg rounded   text-black'}
					on:click={() => jadwalClick(4)}
					><div class="text-xs"><small>Jadwal4</small></div>
					<div class="text-xs font-bold">{waktuSemprot4}</div>
				</button>
				<button
					class={jadwal5Enable
						? 'border border-gray-700 shadow-lg rounded  bg-green-700 text-white'
						: 'border border-gray-700 shadow-lg rounded   text-black'}
					on:click={() => jadwalClick(5)}
					><div class="text-xs"><small>Jadwal5</small></div>
					<div class="text-xs font-bold">{waktuSemprot5}</div>
				</button>
			</div>

			<details class="dropdown w-full h-56">
				<!--set dosis manual-->
				<summary
					class="text-xl mt-4 pt-1 text-center bg-[#0000ff] text-white h-10 rounded-lg rounded-bl-none rounded-br-none border border-blue-950"
					>Semprot Pestisida</summary
				>
				<div
					class="w-full dropdown-content z-[1] bg-white rounded-lg rounded-tl-none rounded-tr-none shadow-lg border"
				>
					<div class="grid grid-cols-2 gap-2 h-14 px-2 mt-4">
						<label class=" border rounded border-emerald-650">
							<div class="text-center text-xs bg-blue-100 rounded rounded-bl-none rounded-br-none">
								Dosis Air <b>{$dosisAirPestisida}</b> Liter
							</div>
							<div class="grid justify-items-center">
								<input
									class="w-3/4 h-2 mt-4"
									type="range"
									bind:value={$dosisAirPestisida}
									on:change={() => simpanDosisAirPestisida()}
									min="1"
									max="20"
								/>
							</div>
						</label>
						<label class=" border rounded border-emerald-650">
							<div class="text-center text-xs bg-blue-100 rounded rounded-bl-none rounded-br-none">
								Dosis Pestisida <b>{$dosisPestisida}</b> mL
							</div>
							<div class="grid justify-items-center">
								<input
									class="w-3/4 h-2 mt-4"
									type="range"
									bind:value={$dosisPestisida}
									on:change={() => simpanDosisPestisida()}
									min="1"
									max="50"
								/>
							</div>
						</label>
					</div>

					<!--pilih lahan-->
					<div class="grid grid-cols-4 mt-4">
						<div class="col-span-2 p-2">
							<div class="grid grid-cols-2 gap-2">
								<label class="swap h-10 w-full text-center text-xs">
									<small class="mt-6 font-bold">Lahan1</small>
									<input
										type="checkbox"
										bind:checked={$lahan1Pestisida_status}
										on:change={() => semprotPestisida(1)}
									/>
									<div class="swap-on h-6 w-12">
										<img src=" /on6.png" alt="btn_on" />
									</div>
									<div class="swap-off h-6 w-12">
										<img src=" /off6.png" alt="btn_off" />
									</div>
								</label>
								<label class="swap h-10 w-full text-center text-xs">
									<small class="mt-6 font-bold">Lahan2</small>
									<input
										type="checkbox"
										bind:checked={$lahan2Pestisida_status}
										on:change={() => semprotPestisida(2)}
									/>
									<div class="swap-on h-6 w-12">
										<img src=" /on6.png" alt="btn_on" />
									</div>
									<div class="swap-off h-6 w-12">
										<img src=" /off6.png" alt="btn_off" />
									</div>
								</label>
								<label class="swap h-10 w-full text-center text-xs">
									<small class="mt-6 font-bold">Lahan3</small>
									<input
										type="checkbox"
										bind:checked={$lahan3Pestisida_status}
										on:change={() => semprotPestisida(3)}
									/>
									<div class="swap-on h-6 w-12">
										<img src=" /on6.png" alt="btn_on" />
									</div>
									<div class="swap-off h-6 w-12">
										<img src=" /off6.png" alt="btn_off" />
									</div>
								</label>
								<label class="swap h-10 w-full text-center text-xs">
									<small class="mt-6 font-bold">Lahan4</small>
									<input
										type="checkbox"
										bind:checked={$lahan4Pestisida_status}
										on:change={() => semprotPestisida(4)}
									/>
									<div class="swap-on h-6 w-12">
										<img src=" /on6.png" alt="btn_on" />
									</div>
									<div class="swap-off h-6 w-12">
										<img src=" /off6.png" alt="btn_off" />
									</div>
								</label>
							</div>
						</div>
						<div class="col-span-2 p-2">
							<div class="grid grid-cols-2 gap-2">
								<div
									class="w-full h-20 grid justify-items-center rounded-lg shadow-lg border border-gray-400"
								></div>

								<div
									class="w-full h-20 grid justify-items-center rounded-lg shadow-lg border border-gray-400"
								>
									<small class=" text-xs">Semua</small>
									<label class="swap h-12 w-12">
										<!-- this hidden checkbox controls the state -->
										<input
											type="checkbox"
											bind:checked={$pestisida_status}
											on:change={() => semprotPestisida(0)}
										/>
										<div class="swap-on">
											<img src=" /on4.png" alt="btn_on" />
										</div>
										<div class="swap-off">
											<img src=" /off4.png" alt="btn_off" />
										</div>
									</label>
								</div>
							</div>
						</div>
					</div>
				</div>
			</details>

			<!--menu-->
			<details class="dropdown w-full h-32 dropdown-top dropdown-end">
				<summary class="flex justify-end"
					><svg
						fill="#000000"
						class="w-8 h-8"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						viewBox="-5.6 -5.6 67.20 67.20"
						xml:space="preserve"
						stroke="#000000"
						stroke-width="0.00056"
						><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
							id="SVGRepo_tracerCarrier"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke="#CCCCCC"
							stroke-width="7.839999999999999"
						>
							<path
								d="M28,0C12.561,0,0,12.561,0,28s12.561,28,28,28s28-12.561,28-28S43.439,0,28,0z M40,41H16c-1.104,0-2-0.896-2-2s0.896-2,2-2 h24c1.104,0,2,0.896,2,2S41.104,41,40,41z M40,30H16c-1.104,0-2-0.896-2-2s0.896-2,2-2h24c1.104,0,2,0.896,2,2S41.104,30,40,30z M40,19H16c-1.104,0-2-0.896-2-2s0.896-2,2-2h24c1.104,0,2,0.896,2,2S41.104,19,40,19z"
							></path>
						</g><g id="SVGRepo_iconCarrier">
							<path
								d="M28,0C12.561,0,0,12.561,0,28s12.561,28,28,28s28-12.561,28-28S43.439,0,28,0z M40,41H16c-1.104,0-2-0.896-2-2s0.896-2,2-2 h24c1.104,0,2,0.896,2,2S41.104,41,40,41z M40,30H16c-1.104,0-2-0.896-2-2s0.896-2,2-2h24c1.104,0,2,0.896,2,2S41.104,30,40,30z M40,19H16c-1.104,0-2-0.896-2-2s0.896-2,2-2h24c1.104,0,2,0.896,2,2S41.104,19,40,19z"
							></path>
						</g></svg
					>
				</summary>

				<ul class="w-1/2 dropdown-content z-[1] rounded shadow-lg border">
					<li>
						<a href="/home" class="grid grid-cols-4 bg-gray-200 p-2"
							><img class="w-8 h-8" src="/btn_home2.png" alt="home" />
							<div class="col-span-3 p-1">Home</div></a
						>
					</li>
					<li>
						<a href="/siram" class="grid grid-cols-4 bg-white p-2"
							><img class="w-8 h-8" src="/penyiraman.png" alt="siram" />
							<div class="col-span-3 p-1">Siram</div></a
						>
					</li>
					<li>
						<a href="/pestisida" class="grid grid-cols-4 bg-gray-200 p-2"
							><img class="w-8 h-8" src="/pestisida.png" alt="pest" />
							<div class="col-span-3 p-1">Pestisida</div></a
						>
					</li>
					<li>
						<a href="/biopest" class="grid grid-cols-4 bg-white p-2"
							><img class="w-8 h-8" src="/biopestisida.png" alt="biopest" />
							<div class="col-span-3 p-1">Biopestisida</div></a
						>
					</li>
					<li>
						<a href="/setup" class="grid grid-cols-4 bg-gray-200 p-2"
							><img class="w-8 h-8" src="/setup.png" alt="home" />
							<div class="col-span-3 p-1">Setup</div></a
						>
					</li>
					<li>
						<a href="/" class="grid grid-cols-4 bg-white p-2"
							><svg
								fill="#000000"
								class="w-6 h-6"
								version="1.1"
								id="Layer_1"
								xmlns="http://www.w3.org/2000/svg"
								xmlns:xlink="http://www.w3.org/1999/xlink"
								viewBox="0 0 512 512"
								enable-background="new 0 0 512 512"
								xml:space="preserve"
								><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
									id="SVGRepo_tracerCarrier"
									stroke-linecap="round"
									stroke-linejoin="round"
								></g><g id="SVGRepo_iconCarrier">
									<path
										d="M469.3,469.3H42.7V42.7H256L298.7,0h-256C19.1,0,0,19.1,0,42.7v426.7C0,492.9,19.1,512,42.7,512h426.7 c23.6,0,42.7-19.1,42.7-42.7V320l-42.7,42.7V469.3z M85.3,426.7C149.1,255.7,234.7,256,362.7,256v85.3L512,192L362.7,42.7V128 C85.3,128,85.1,341.1,85.3,426.7z"
									></path>
								</g></svg
							>
							<div class="col-span-3 p-1">Keluar</div></a
						>
					</li>
				</ul>
			</details>
		</div>
	</div>
</div>

<!--Jadwal-->
<Modal bind:showModal bind:timeOut>
	{#if showMode === 1}<!--mode jadwal-->
		<!-- jadwal 1-->
		{#if showjadwal === 1}
			<div class="grid grid-cols-10 gap-2 mt-2 justify-items-center">
				<div class=" col-span-10 text-center">Jadwal 1</div>
				<!--waktu dan dosis-->
				<div class="col-span-10 h-20 mt-2">
					<div class="grid grid-cols-2 gap-2 w-full">
						<div class="border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Waktu
							</div>
							<SveltyPicker
								bind:value={waktuSemprot1}
								inputClasses="w-3/4 font-bold text-lg text-center mx-4"
								placeholder="06:30"
								format="hh:ii"
								displayFormat="hh:ii "
							/>
						</div>
						<div class="border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Aktifkan
							</div>
							<label class="swap h-10 w-full text-center text-xs">
								<input
									type="checkbox"
									bind:checked={jadwal1Enable}
									on:change={() => jadwalAktif(1)}
								/>
								<div class="swap-on h-6 w-12">
									<img src=" /on6.png" alt="btn_on" />
								</div>
								<div class="swap-off h-6 w-12">
									<img src=" /off6.png" alt="btn_off" />
								</div>
							</label>
						</div>

						<label class=" border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Dosis Air <b>{dosisAirPestisida1}</b> Liter
							</div>
							<div class="grid justify-items-center">
								<input
									class="w-3/4 h-2 my-4"
									type="range"
									bind:value={dosisAirPestisida1}
									min="1"
									max="20"
								/>
							</div>
						</label>
						<label class=" border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Dosis Pestisida <b>{dosisPestisida1}</b> mL
							</div>
							<div class="grid justify-items-center">
								<input
									class="w-3/4 h-2 my-4"
									type="range"
									bind:value={dosisPestisida1}
									min="1"
									max="50"
								/>
							</div>
						</label>
					</div>
				</div>

				<!-- hari-->
				<div class="col-span-10 text-xs mt-12">
					<div class="grid grid-cols-7 gap-4 mb-2 ml-1 justify-items-center">
						{#each hari as hariNow, idx}
							<label class="text-xs font-bold">
								<div><small>{hariNow}</small></div>
								<input
									type="checkbox"
									bind:checked={cekHari1[idx]}
									on:change={() => pilihanHari1Click(idx)}
								/>
							</label>
						{/each}
					</div>
				</div>

				<div class="col-span-10 text-xs border mb-2 px-2">
					<div class="grid grid-cols-4 gap-4 p-2 justify-items-center">
						{#each lahan as lahanNow, idx}
							<label class="grid justify-items-center">
								<input
									type="checkbox"
									bind:checked={cekLahan1[idx]}
									on:change={() => lahan1Click(idx)}
								/>
								<div><small>{lahanNow}</small></div>
							</label>
						{/each}
					</div>
				</div>
			</div>
			<!-- jadwal 2-->
		{:else if showjadwal === 2}
			<div class="grid grid-cols-10 gap-2 mt-2 justify-items-center">
				<div class=" col-span-10 text-center">Jadwal 2</div>
				<!--waktu dan dosis-->
				<div class="col-span-10 h-20 mt-2">
					<div class="grid grid-cols-2 gap-2 w-full">
						<div class="border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Waktu
							</div>
							<SveltyPicker
								bind:value={waktuSemprot2}
								inputClasses="w-3/4 font-bold text-lg text-center mx-4"
								placeholder="06:30"
								format="hh:ii"
								displayFormat="hh:ii "
							/>
						</div>
						<div class="border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Aktifkan
							</div>
							<label class="swap h-10 w-full text-center text-xs">
								<input
									type="checkbox"
									bind:checked={jadwal2Enable}
									on:change={() => jadwalAktif(2)}
								/>
								<div class="swap-on h-6 w-12">
									<img src=" /on6.png" alt="btn_on" />
								</div>
								<div class="swap-off h-6 w-12">
									<img src=" /off6.png" alt="btn_off" />
								</div>
							</label>
						</div>

						<label class=" border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Dosis Air <b>{dosisAirPestisida2}</b> Liter
							</div>
							<div class="grid justify-items-center">
								<input
									class="w-3/4 h-2 my-4"
									type="range"
									bind:value={dosisAirPestisida2}
									min="1"
									max="20"
								/>
							</div>
						</label>
						<label class=" border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Dosis Pestisida <b>{dosisPestisida2}</b> mL
							</div>
							<div class="grid justify-items-center">
								<input
									class="w-3/4 h-2 my-4"
									type="range"
									bind:value={dosisPestisida2}
									min="1"
									max="50"
								/>
							</div>
						</label>
					</div>
				</div>

				<!-- hari-->
				<div class="col-span-10 text-xs mt-12">
					<div class="grid grid-cols-7 gap-4 mb-2 ml-1 justify-items-center">
						{#each hari as hariNow, idx}
							<label class="text-xs font-bold">
								<div><small>{hariNow}</small></div>
								<input
									type="checkbox"
									bind:checked={cekHari2[idx]}
									on:change={() => pilihanHari2Click(idx)}
								/>
							</label>
						{/each}
					</div>
				</div>

				<div class="col-span-10 text-xs border mb-2 px-2">
					<div class="grid grid-cols-4 gap-4 p-2 justify-items-center">
						{#each lahan as lahanNow, idx}
							<label class="grid justify-items-center">
								<input
									type="checkbox"
									bind:checked={cekLahan2[idx]}
									on:change={() => lahan2Click(idx)}
								/>
								<div><small>{lahanNow}</small></div>
							</label>
						{/each}
					</div>
				</div>
			</div>
			<!-- jadwal 3-->
		{:else if showjadwal === 3}
			<div class="grid grid-cols-10 gap-2 mt-2 justify-items-center">
				<div class=" col-span-10 text-center">Jadwal 3</div>
				<!--waktu dan dosis-->
				<div class="col-span-10 h-20 mt-2">
					<div class="grid grid-cols-2 gap-2 w-full">
						<div class="border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Waktu
							</div>
							<SveltyPicker
								bind:value={waktuSemprot3}
								inputClasses="w-3/4 font-bold text-lg text-center mx-4"
								placeholder="06:30"
								format="hh:ii"
								displayFormat="hh:ii "
							/>
						</div>
						<div class="border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Aktifkan
							</div>
							<label class="swap h-10 w-full text-center text-xs">
								<input
									type="checkbox"
									bind:checked={jadwal3Enable}
									on:change={() => jadwalAktif(3)}
								/>
								<div class="swap-on h-6 w-12">
									<img src=" /on6.png" alt="btn_on" />
								</div>
								<div class="swap-off h-6 w-12">
									<img src=" /off6.png" alt="btn_off" />
								</div>
							</label>
						</div>

						<label class=" border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Dosis Air <b>{dosisAirPestisida3}</b> Liter
							</div>
							<div class="grid justify-items-center">
								<input
									class="w-3/4 h-2 my-4"
									type="range"
									bind:value={dosisAirPestisida3}
									min="1"
									max="20"
								/>
							</div>
						</label>
						<label class=" border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Dosis Pestisida <b>{dosisPestisida3}</b> mL
							</div>
							<div class="grid justify-items-center">
								<input
									class="w-3/4 h-2 my-4"
									type="range"
									bind:value={dosisPestisida3}
									min="1"
									max="50"
								/>
							</div>
						</label>
					</div>
				</div>

				<!-- hari-->
				<div class="col-span-10 text-xs mt-12">
					<div class="grid grid-cols-7 gap-4 mb-2 ml-1 justify-items-center">
						{#each hari as hariNow, idx}
							<label class="text-xs font-bold">
								<div><small>{hariNow}</small></div>
								<input
									type="checkbox"
									bind:checked={cekHari3[idx]}
									on:change={() => pilihanHari3Click(idx)}
								/>
							</label>
						{/each}
					</div>
				</div>

				<div class="col-span-10 text-xs border mb-2 px-2">
					<div class="grid grid-cols-4 gap-4 p-2 justify-items-center">
						{#each lahan as lahanNow, idx}
							<label class="grid justify-items-center">
								<input
									type="checkbox"
									bind:checked={cekLahan3[idx]}
									on:change={() => lahan3Click(idx)}
								/>
								<div><small>{lahanNow}</small></div>
							</label>
						{/each}
					</div>
				</div>
			</div>
		{:else if showjadwal === 4}
			<div class="grid grid-cols-10 gap-2 mt-2 justify-items-center">
				<div class=" col-span-10 text-center">Jadwal 4</div>
				<!--waktu dan dosis-->
				<div class="col-span-10 h-20 mt-2">
					<div class="grid grid-cols-2 gap-2 w-full">
						<div class="border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Waktu
							</div>
							<SveltyPicker
								bind:value={waktuSemprot4}
								inputClasses="w-3/4 font-bold text-lg text-center mx-4"
								placeholder="06:30"
								format="hh:ii"
								displayFormat="hh:ii "
							/>
						</div>
						<div class="border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Aktifkan
							</div>
							<label class="swap h-10 w-full text-center text-xs">
								<input
									type="checkbox"
									bind:checked={jadwal4Enable}
									on:change={() => jadwalAktif(4)}
								/>
								<div class="swap-on h-6 w-12">
									<img src=" /on6.png" alt="btn_on" />
								</div>
								<div class="swap-off h-6 w-12">
									<img src=" /off6.png" alt="btn_off" />
								</div>
							</label>
						</div>

						<label class=" border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Dosis Air <b>{dosisAirPestisida4}</b> Liter
							</div>
							<div class="grid justify-items-center">
								<input
									class="w-3/4 h-2 my-4"
									type="range"
									bind:value={dosisAirPestisida4}
									min="1"
									max="20"
								/>
							</div>
						</label>
						<label class=" border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Dosis Pestisida <b>{dosisPestisida4}</b> mL
							</div>
							<div class="grid justify-items-center">
								<input
									class="w-3/4 h-2 my-4"
									type="range"
									bind:value={dosisPestisida4}
									min="1"
									max="50"
								/>
							</div>
						</label>
					</div>
				</div>

				<!-- hari-->
				<div class="col-span-10 text-xs mt-12">
					<div class="grid grid-cols-7 gap-4 mb-2 ml-1 justify-items-center">
						{#each hari as hariNow, idx}
							<label class="text-xs font-bold">
								<div><small>{hariNow}</small></div>
								<input
									type="checkbox"
									bind:checked={cekHari4[idx]}
									on:change={() => pilihanHari4Click(idx)}
								/>
							</label>
						{/each}
					</div>
				</div>

				<div class="col-span-10 text-xs border mb-2 px-2">
					<div class="grid grid-cols-4 gap-4 p-2 justify-items-center">
						{#each lahan as lahanNow, idx}
							<label class="grid justify-items-center">
								<input
									type="checkbox"
									bind:checked={cekLahan4[idx]}
									on:change={() => lahan4Click(idx)}
								/>
								<div><small>{lahanNow}</small></div>
							</label>
						{/each}
					</div>
				</div>
			</div>
			<!-- jadwal 5-->
		{:else if showjadwal === 5}
			<div class="grid grid-cols-10 gap-2 mt-2 justify-items-center">
				<div class=" col-span-10 text-center">Jadwal 5</div>
				<!--waktu dan dosis-->
				<div class="col-span-10 h-20 mt-2">
					<div class="grid grid-cols-2 gap-2 w-full">
						<div class="border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Waktu
							</div>
							<SveltyPicker
								bind:value={waktuSemprot5}
								inputClasses="w-3/4 font-bold text-lg text-center mx-4"
								placeholder="06:30"
								format="hh:ii"
								displayFormat="hh:ii "
							/>
						</div>
						<div class="border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Aktifkan
							</div>
							<label class="swap h-10 w-full text-center text-xs">
								<input
									type="checkbox"
									bind:checked={jadwal5Enable}
									on:change={() => jadwalAktif(5)}
								/>
								<div class="swap-on h-6 w-12">
									<img src=" /on6.png" alt="btn_on" />
								</div>
								<div class="swap-off h-6 w-12">
									<img src=" /off6.png" alt="btn_off" />
								</div>
							</label>
						</div>

						<label class=" border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Dosis Air <b>{dosisAirPestisida5}</b> Liter
							</div>
							<div class="grid justify-items-center">
								<input
									class="w-3/4 h-2 my-4"
									type="range"
									bind:value={dosisAirPestisida5}
									min="1"
									max="20"
								/>
							</div>
						</label>
						<label class=" border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Dosis Pestisida <b>{dosisPestisida5}</b> mL
							</div>
							<div class="grid justify-items-center">
								<input
									class="w-3/4 h-2 my-4"
									type="range"
									bind:value={dosisPestisida5}
									min="1"
									max="50"
								/>
							</div>
						</label>
					</div>
				</div>

				<!-- hari-->
				<div class="col-span-10 text-xs mt-12">
					<div class="grid grid-cols-7 gap-4 mb-2 ml-1 justify-items-center">
						{#each hari as hariNow, idx}
							<label class="text-xs font-bold">
								<div><small>{hariNow}</small></div>
								<input
									type="checkbox"
									bind:checked={cekHari5[idx]}
									on:change={() => pilihanHari5Click(idx)}
								/>
							</label>
						{/each}
					</div>
				</div>

				<div class="col-span-10 text-xs border mb-2 px-2">
					<div class="grid grid-cols-4 gap-4 p-2 justify-items-center">
						{#each lahan as lahanNow, idx}
							<label class="grid justify-items-center">
								<input
									type="checkbox"
									bind:checked={cekLahan5[idx]}
									on:change={() => lahan5Click(idx)}
								/>
								<div><small>{lahanNow}</small></div>
							</label>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!---->
		{#if showjadwal !== 0}
			<div class="grid justify-items-center">
				<button
					on:click={() => {
						showModal = false;
						simpanJadwalPestisida();
					}}
					class="w-1/2 h-12 border rounded-lg bg-green-900 text-white mt-4 mb-4"
					>Simpan Jadwal</button
				>
			</div>
		{/if}
	{:else if showMode === 3}<!--mode alert-->
		<!-- alert-->
		<h3 class="text-xl font-bold text-center text-red-500">!!! Perhatian !!!</h3>
		<hr />
		{#if alertType === 0}
			{#if $runMode === 1}
				<div>Sedang Penyiraman</div>
			{:else if $runMode === 2}
				<div>Sedang Penyemprotan Pestisida</div>
			{:else if $runMode === 3}
				<div>Sedang Penyemproten Biopest</div>
			{/if}
		{:else if alertType === 1}
			<div class="text-center w-full">Fungsi ini tidak berjalan di mode Demo</div>
		{:else if alertType === 2}<!--koneksi-->
			<div class="text-center w-full">Sedang Offline</div>
		{:else if alertType === 3}<!--lahan-->
			<div class="text-center w-full">Pilih Lahan</div>
		{:else if alertType === 4}<!--Hari-->
			<div class="text-center w-full">Pilih Hari</div>
		{:else if alertType === 5}<!--simpan jadwal-->
			<div class="text-center w-full">Jadwal pestisida Disimpan</div>
		{/if}
	{/if}
</Modal>

<style>
	.bg_pestisida {
		background-image: url(' /bg_pestisida.png');
		background-size: cover;
		background-position: center;
	}
	.hd_pestisida1 {
		background-image: url('/hd_pestisida1.png');
		background-size: cover;
		background-position: center;
	}
</style>
