<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { kirimMsg } from '$lib/mqttHandle';
	
	import {
		lengas1,
		lengas2,
		lengas3,
		lengas4,
		volumeAir,
		ambangLengas,
		useLengas,
		lahan1_status,
		lahan2_status,
		lahan3_status,
		lahan4_status,
		siram_status,
		firtLoad,
		resetAllValue,
		newJadwalSiram,
		jadwalSiram,
		demoMode,
		durasiManual,
		runMode,
		conect_status,
		siramCount,
		kontrolIDStore,
		ble_connected
	} from '$lib/store/stores';

	import Modal from '$lib/Modal.svelte';
	import SveltyPicker from 'svelty-picker';

	import { get } from 'svelte/store';

	let showjadwal = 0;
	let showMode = 0; //1 = jadwal ,2 = set durasi,alert
	let jadwal1Enable = false;
	let jadwal2Enable = false;
	let jadwal3Enable = false;
	let jadwal4Enable = false;
	let jadwal5Enable = false;

	let durasiSiram1 = 5;
	let durasiSiram2 = 5;
	let durasiSiram3 = 5;
	let durasiSiram4 = 5;
	let durasiSiram5 = 5;
	let waktuSiram1 = '06:00';
	let waktuSiram2 = '06:00';
	let waktuSiram3 = '06:00';
	let waktuSiram4 = '06:00';
	let waktuSiram5 = '06:00';
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
	let ambangLengas_local = 60;

	onMount(() => {
		resetAllValue();
		if ($firtLoad) {
			goto('/');
		}

		getAllStatus();
		setTimeout(loadJadwalSiram, 1000);
		setTimeout(getDurasiSiram, 2000);

		//}
		showjadwal = 0;
	});

	function getAllStatus() {
		kirimMsg('siram', 0, 'getAllStatus', '0');
	}
	function getDurasiSiram() {
		kirimMsg('siram', 0, 'getDurasi', '0');
	}
	function loadJadwalSiram() {
		if ($jadwalSiram.length >= 200) {
			//console.log('jadwal siram len: ' + $jadwalSiram.length);
			loadJadwal();
		} else {
			//default Jadwal
			console.log('load default jadwal');
			let jw =
				'0,1,0,07,00,1,1,1,1,1,1,1,1,1,1,1,02,04,5;0,2,0,11,30,1,1,1,1,1,1,1,1,1,1,1,03,10,3;0,3,0,16,00,1,1,1,1,1,1,1,1,1,1,1,0,0,5;0,4,0,11,30,1,1,1,1,1,1,1,1,1,1,1,0,0,3;0,5,0,16,00,1,1,1,1,1,1,1,1,1,1,1,0,0,5;';
			$jadwalSiram = jw;
			loadJadwal();
		}
	}

	function siramLahan(lahan) {
		let lahanSts = '0';
		if (($conect_status) || ($ble_connected)) {
			if ($runMode === 0 || $runMode === 1) {
				$runMode = 1;
				if (lahan == 0) {
					if ($siram_status) {
						lahanSts = '1';
						$lahan1_status = true;
						$lahan2_status = true;
						$lahan3_status = true;
						$lahan4_status = true;
					} else {
						lahanSts = '0';
						$lahan1_status = false;
						$lahan2_status = false;
						$lahan3_status = false;
						$lahan4_status = false;
					}
				} else if (lahan == 1) {
					if ($lahan1_status) {
						lahanSts = '1';
						$siram_status = true;
					} else {
						lahanSts = '0';
						if (!$lahan2_status && !$lahan3_status && !$lahan4_status) {
							$siram_status = false;
						}
					}
				} else if (lahan == 2) {
					if ($lahan2_status) {
						lahanSts = '1';
						$siram_status = true;
					} else {
						lahanSts = '0';
						if (!$lahan1_status && !$lahan3_status && !$lahan4_status) {
							$siram_status = false;
						}
					}
				} else if (lahan == 3) {
					if ($lahan3_status) {
						lahanSts = '1';
						$siram_status = true;
					} else {
						lahanSts = '0';
						if (!$lahan2_status && !$lahan1_status && !$lahan4_status) {
							$siram_status = false;
						}
					}
				} else if (lahan == 4) {
					if ($lahan4_status) {
						lahanSts = '1';
						$siram_status = true;
					} else {
						lahanSts = '0';
						if (!$lahan2_status && !$lahan3_status && !$lahan1_status) {
							$siram_status = false;
						}
					}
				}

				//console.log('siram lahan ' + lahan + '=> ' + lahanSts + '(1=ON,0=OFF)');
				if (!$demoMode) {
					kirimMsg('siram', lahan, 'cmd', lahanSts);
				} else {
					alertDemo();
					$lahan1_status = false;
					$lahan2_status = false;
					$lahan3_status = false;
					$lahan4_status = false;
					$siram_status = false;
				}
			} else {
				//
				$lahan1_status = false;
				$lahan2_status = false;
				$lahan3_status = false;
				$lahan4_status = false;
				$siram_status = false;

				alertShow($runMode);
			}
		} else {
			alertConect();
			$lahan1_status = false;
			$lahan2_status = false;
			$lahan3_status = false;
			$lahan4_status = false;
			$siram_status = false;
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

	function trigerLengasChange() {
		//console.log('triger lengas: ' + $ambangLengas);
		if (!$demoMode) {
			if (($conect_status) || ($ble_connected)) {
				kirimMsg('siram', '0', 'setAmbang', String($ambangLengas));
			} else {
				alertConect();
			}
		} else {
			alertDemo();
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
		jw += ',1,0,'; //kode 0 siram
		let wt = waktuSiram1.split(':');
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
		jw += '0,0,';
		jw += String(durasiSiram1);
		jw += ';';

		//jadwal 2
		if (jadwal2Enable) {
			jw += '1';
		} else {
			jw += '0';
		}
		jw += ',2,0,'; //kode 0 siram
		wt = waktuSiram2.split(':');
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
		jw += '0,0,';
		jw += String(durasiSiram2);
		jw += ';';

		//jadwal 3
		if (jadwal3Enable) {
			jw += '1';
		} else {
			jw += '0';
		}
		jw += ',3,0,'; //kode 0 siram
		wt = waktuSiram3.split(':');
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
		jw += '0,0,';
		jw += String(durasiSiram3);
		jw += ';';

		//jadwal 4
		if (jadwal4Enable) {
			jw += '1';
		} else {
			jw += '0';
		}
		jw += ',4,0,'; //kode 0 siram
		wt = waktuSiram4.split(':');
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
		jw += '0,0,';
		jw += String(durasiSiram4);
		jw += ';';

		//jadwal 5
		if (jadwal5Enable) {
			jw += '1';
		} else {
			jw += '0';
		}
		jw += ',5,0,'; //kode 0 siram
		wt = waktuSiram5.split(':');
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
		jw += '0,0,';
		jw += String(durasiSiram5);
		jw += ';';

		return jw;
	}

	function simpanJadwalSiram() {
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
				kirimMsg('siram', 0, 'setJadwal', jwl);
			}
		}
	}

	function loadJadwal() {
		//format
		//enable,idx,jenis,H,M,s,s,r,k,j,s,m,l1,l2,l3,l4,A,P,T;enable,idx,jenis,H,M,s,s,r,k,j,s,m,l1,l2,l3,l4,A,P,T;enable,idx,jenis,H,M,s,s,r,k,j,s,m,l1,l2,l3,l4,A,P,T

		let jadwal123 = $jadwalSiram.split(';');
		//jadwal1
		let jadwal1 = jadwal123[0].split(',');
		if (jadwal1[0] === '1') {
			jadwal1Enable = true;
		} else {
			jadwal1Enable = false;
		}
		waktuSiram1 = jadwal1[3] + ':';
		waktuSiram1 += jadwal1[4];

		for (let i = 0; i < 7; i++) {
			if (jadwal1[5 + i] === '1') {
				cekHari1[i] = true;
				pilihanHari1[i] = 1;
			} else {
				cekHari1[i] = false;
				pilihanHari1[i] = 0;
			}
		}
		for (let i = 0; i < 4; i++) {
			if (jadwal1[12 + i] === '1') {
				cekLahan1[i] = true;
				pilihanLahan1[i] = 1;
			} else {
				cekLahan1[i] = false;
				pilihanLahan1[i] = 0;
			}
		}
		durasiSiram1 = parseInt(jadwal1[18]);
		//jadwal2
		let jadwal2 = jadwal123[1].split(',');
		if (jadwal2[0] === '1') {
			jadwal2Enable = true;
		} else {
			jadwal2Enable = false;
		}
		waktuSiram2 = jadwal2[3] + ':';
		waktuSiram2 += jadwal2[4];
		for (let i = 0; i < 7; i++) {
			if (jadwal2[5 + i] === '1') {
				cekHari2[i] = true;
				pilihanHari2[i] = 1;
			} else {
				cekHari2[i] = false;
				pilihanHari2[i] = 0;
			}
		}
		for (let i = 0; i < 4; i++) {
			if (jadwal2[12 + i] === '1') {
				cekLahan2[i] = true;
				pilihanLahan2[i] = 1;
			} else {
				cekLahan2[i] = false;
				pilihanLahan2[i] = 0;
			}
		}
		durasiSiram2 = parseInt(jadwal1[18]);
		//jadwal3
		let jadwal3 = jadwal123[2].split(',');
		if (jadwal3[0] === '1') {
			jadwal3Enable = true;
		} else {
			jadwal3Enable = false;
		}
		waktuSiram3 = jadwal3[3] + ':';
		waktuSiram3 += jadwal3[4];
		for (let i = 0; i < 7; i++) {
			if (jadwal3[5 + i] === '1') {
				cekHari3[i] = true;
				pilihanHari3[i] = 1;
			} else {
				cekHari3[i] = false;
				pilihanHari3[i] = 0;
			}
		}
		for (let i = 0; i < 4; i++) {
			if (jadwal3[12 + i] === '1') {
				cekLahan3[i] = true;
				pilihanLahan3[i] = 1;
			} else {
				cekLahan3[i] = false;
				pilihanLahan3[i] = 0;
			}
		}
		durasiSiram3 = parseInt(jadwal3[18]);
		//jadwal4
		let jadwal4 = jadwal123[3].split(',');
		if (jadwal4[0] === '1') {
			jadwal4Enable = true;
		} else {
			jadwal4Enable = false;
		}
		waktuSiram4 = jadwal4[3] + ':';
		waktuSiram4 += jadwal4[4];
		for (let i = 0; i < 7; i++) {
			if (jadwal4[5 + i] === '1') {
				cekHari4[i] = true;
				pilihanHari4[i] = 1;
			} else {
				cekHari4[i] = false;
				pilihanHari4[i] = 0;
			}
		}
		for (let i = 0; i < 4; i++) {
			if (jadwal4[12 + i] === '1') {
				cekLahan4[i] = true;
				pilihanLahan4[i] = 1;
			} else {
				cekLahan4[i] = false;
				pilihanLahan4[i] = 0;
			}
		}
		durasiSiram4 = parseInt(jadwal4[18]);
		//jadwal5
		let jadwal5 = jadwal123[4].split(',');
		if (jadwal5[0] === '1') {
			jadwal5Enable = true;
		} else {
			jadwal5Enable = false;
		}
		waktuSiram5 = jadwal5[3] + ':';
		waktuSiram5 += jadwal5[4];
		for (let i = 0; i < 7; i++) {
			if (jadwal5[5 + i] === '1') {
				cekHari5[i] = true;
				pilihanHari5[i] = 1;
			} else {
				cekHari5[i] = false;
				pilihanHari5[i] = 0;
			}
		}
		for (let i = 0; i < 4; i++) {
			if (jadwal5[12 + i] === '1') {
				cekLahan5[i] = true;
				pilihanLahan5[i] = 1;
			} else {
				cekLahan5[i] = false;
				pilihanLahan5[i] = 0;
			}
		}
		durasiSiram5 = parseInt(jadwal5[18]);

		waktuSiram1 = waktuSiram1;
		waktuSiram2 = waktuSiram2;
		waktuSiram3 = waktuSiram3;
		waktuSiram4 = waktuSiram4;
		waktuSiram5 = waktuSiram5;
	}

	function showJadwalSiram() {
		showModal = true;
		showMode = 1;
		if ($newJadwalSiram) {
			loadJadwal();
			newJadwalSiram.set(false);
			//
		}
	}

	function setDurasiClick() {
		showModal = true;
		showMode = 2;
		timeOut = 0;
	}

	function simpanDurasi() {
		if (!$demoMode) {
			if (($conect_status) || ($ble_connected)) {
				kirimMsg('siram', 0, 'setDurasi', String($durasiManual));
			} else {
				alertConect();
			}
		} else {
			alertDemo();
		}
	}

	function jadwalClick(jadwal = 1) {
		showModal = true;
		showMode = 1;
		showjadwal = jadwal;
		timeOut = 0;
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
	$: if ($newJadwalSiram == true) {
		loadJadwalSiram();
		newJadwalSiram.set(false);
	}
</script>

<div class="h-screen w-screen">
	<div class="bg_siram h-full w-full grid justify-items-center max-w-md mx-auto flex flex-col">
		<div class="hd_siram1 w-full h-16">
			<div class="text-xs w-full text-center mt-14">{get(kontrolIDStore)}</div>
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
			<!-- info lengas-->
			<div class="grid grid-cols-4 gap-2 w-full mt-8">
				<div class="w-full rounded shadow-xl">
					<div class="text-xs font-bold text-center"><small>Lengas1</small></div>
					<div class="text-xl font-bold text-center">{$lengas1}%</div>
					<div class="text-xs text-center"><small>lastUpdate</small></div>
				</div>

				<div class="w-full rounded shadow-xl">
					<div class="text-xs font-bold text-center"><small>Lengas2</small></div>
					<div class="text-xl font-bold text-center">{$lengas2}%</div>
					<div class="text-xs text-center"><small>lastUpdate</small></div>
				</div>

				<div class="w-full rounded shadow-xl">
					<div class="text-xs font-bold text-center"><small>Lengas3</small></div>
					<div class="text-xl font-bold text-center">{$lengas3}%</div>
					<div class="text-xs text-center"><small>lastUpdate</small></div>
				</div>

				<div class="w-full rounded shadow-xl">
					<div class="text-xs font-bold text-center"><small>Lengas4</small></div>
					<div class="text-xl font-bold text-center">{$lengas4}%</div>
					<div class="text-xs text-center"><small>lastUpdate</small></div>
				</div>
			</div>
			<!-- set lengas-->
			<div class="w-full rounded border border-gray-400 shadow-lg p-2 mt-4 grid grid-cols-4">
				<div class="col-span-4 text-xs text-center font-bold my-2">Otomatis Lengas</div>
				<input
					type="range"
					min="30"
					max="100"
					bind:value={$ambangLengas}
					on:change={() => trigerLengasChange()}
					class="range range-warning col-span-3"
				/>

				<div class="font-bold text-xl text-center">{$ambangLengas} %</div>
			</div>
			<!-- jadwal -->
			<div class="grid grid-cols-5 gap-2 mt-4 h-10 w-full">
				<button
					class={jadwal1Enable
						? 'border border-gray-700 shadow-lg rounded  bg-green-700 text-white'
						: 'border border-gray-700 shadow-lg rounded   text-black'}
					on:click={() => jadwalClick(1)}
					><div class="text-xs"><small>Jadwal1</small></div>
					<div class="text-xs font-bold">{waktuSiram1}</div>
				</button>
				<button
					class={jadwal2Enable
						? 'border border-gray-700 shadow-lg rounded   bg-green-700 text-white'
						: 'border border-gray-700 shadow-lg rounded   text-black'}
					on:click={() => jadwalClick(2)}
					><div class="text-xs"><small>Jadwal2</small></div>
					<div class="text-xs font-bold">{waktuSiram2}</div>
				</button>
				<button
					class={jadwal3Enable
						? 'border border-gray-700 shadow-lg rounded  bg-green-700 text-white'
						: 'border border-gray-700 shadow-lg rounded   text-black'}
					on:click={() => jadwalClick(3)}
					><div class="text-xs"><small>Jadwal3</small></div>
					<div class="text-xs font-bold">{waktuSiram3}</div>
				</button>
				<button
					class={jadwal4Enable
						? 'border border-gray-700 shadow-lg rounded  bg-green-700 text-white'
						: 'border border-gray-700 shadow-lg rounded   text-black'}
					on:click={() => jadwalClick(4)}
					><div class="text-xs"><small>Jadwal4</small></div>
					<div class="text-xs font-bold">{waktuSiram4}</div>
				</button>
				<button
					class={jadwal5Enable
						? 'border border-gray-700 shadow-lg rounded  bg-green-700 text-white'
						: 'border border-gray-700 shadow-lg rounded   text-black'}
					on:click={() => jadwalClick(5)}
					><div class="text-xs"><small>Jadwal5</small></div>
					<div class="text-xs font-bold">{waktuSiram5}</div>
				</button>
			</div>

			<details class="dropdown w-full h-56">
				<!--set dosis manual-->
				<summary
					class="text-xl mt-4 text-center bg-[#ff3300] text-white h-10 rounded-lg rounded-bl-none rounded-br-none border border-blue-950"
					>Siram</summary
				>
				<div
					class="w-full dropdown-content z-[1] bg-white rounded-lg rounded-tl-none rounded-tr-none shadow-lg border"
				>
					<!--pilih lahan-->
					<div class="grid grid-cols-4 mt-4">
						<div class="col-span-2 p-2">
							<div class="grid grid-cols-2 gap-2">
								<label class="swap h-10 w-full text-center text-xs">
									<small class="mt-6 font-bold">Lahan1</small>
									<input
										type="checkbox"
										bind:checked={$lahan1_status}
										on:change={() => siramLahan(1)}
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
										bind:checked={$lahan2_status}
										on:change={() => siramLahan(2)}
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
										bind:checked={$lahan3_status}
										on:change={() => siramLahan(3)}
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
										bind:checked={$lahan4_status}
										on:change={() => siramLahan(4)}
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
								>
									<button
										on:click={() => setDurasiClick()}
										class="text-xs text-center text-white w-full h-6 mb-2 bg-gray-500 rounded-lg rounded-bl-none rounded-br-none"
										><small>Durasi {$durasiManual} menit</small></button
									>
									<div class="h-10 grid justify-items-center">
										<div class="text-center text-xs">{$siramCount}</div>
										<div class="text-center text-xs">{$volumeAir}</div>
									</div>
								</div>

								<div
									class="w-full h-20 grid justify-items-center rounded-lg shadow-lg border border-gray-400"
								>
									<small class=" text-xs">Semua</small>
									<label class="swap h-12 w-12">
										<!-- this hidden checkbox controls the state -->
										<input
											type="checkbox"
											bind:checked={$siram_status}
											on:change={() => siramLahan(0)}
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

<!--pop up-->
<Modal bind:showModal bind:timeOut>
	{#if showMode === 1}
		{#if showjadwal === 1}
			<!-- jadwal 1-->
			<div class="grid justify-items-center border-1">
				<div class="w-full text-center font-bold">Jadwal 1</div>
				<div class="w-full grid grid-cols-3 gap-2 mt-4">
					<div class="border rounded border-emerald-950">
						<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
							Waktu
						</div>
						<SveltyPicker
							bind:value={waktuSiram1}
							inputClasses="w-3/4 font-bold text-lg text-center mx-4"
							placeholder="06:30"
							format="hh:ii"
							displayFormat="hh:ii "
						/>
					</div>
					<label class=" border rounded border-emerald-950">
						<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
							Durasi <b>{durasiSiram1}</b> menit
						</div>
						<div class="grid justify-items-center">
							<input
								class="w-3/4 h-2 my-4"
								type="range"
								bind:value={durasiSiram1}
								min="1"
								max="15"
							/>
						</div>
					</label>
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
				</div>
				<!-- hari-->

				<div
					class="w-full p-2 grid grid-cols-7 gap-4 mt-4 justify-items-center border border-gray-300 rounded"
				>
					{#each hari as hariNow, idx}
						<label class="text-xs">
							<div><small>{hariNow}</small></div>
							<input
								type="checkbox"
								bind:checked={cekHari1[idx]}
								on:change={() => pilihanHari1Click(idx)}
							/>
						</label>
					{/each}
				</div>

				<div
					class="w-full grid grid-cols-4 gap-4 p-2 mt-4 justify-items-center rounded border border-gray-450"
				>
					{#each lahan as lahanNow, idx}
						<label class="grid justify-items-center">
							<input
								type="checkbox"
								bind:checked={cekLahan1[idx]}
								on:change={() => lahan1Click(idx)}
							/>
							<div class="text-xs"><small>{lahanNow}</small></div>
						</label>
					{/each}
				</div>
			</div>
		{:else if showjadwal === 2}
			<!-- jadwal 2-->
			<div class="grid justify-items-center border-1">
				<div class="w-full text-center font-bold">Jadwal 2</div>
				<div class="w-full grid grid-cols-3 gap-2 mt-4">
					<div class="border rounded border-emerald-950">
						<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
							Waktu
						</div>
						<SveltyPicker
							bind:value={waktuSiram2}
							inputClasses="w-3/4 font-bold text-lg text-center mx-4"
							placeholder="06:30"
							format="hh:ii"
							displayFormat="hh:ii "
						/>
					</div>
					<label class=" border rounded border-emerald-950">
						<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
							Durasi <b>{durasiSiram2}</b> menit
						</div>
						<div class="grid justify-items-center">
							<input
								class="w-3/4 h-2 my-4"
								type="range"
								bind:value={durasiSiram2}
								min="1"
								max="15"
							/>
						</div>
					</label>
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
				</div>
				<!-- hari-->

				<div
					class="w-full p-2 grid grid-cols-7 gap-4 mt-4 justify-items-center border border-gray-300 rounded"
				>
					{#each hari as hariNow, idx}
						<label class="text-xs">
							<div><small>{hariNow}</small></div>
							<input
								type="checkbox"
								bind:checked={cekHari2[idx]}
								on:change={() => pilihanHari2Click(idx)}
							/>
						</label>
					{/each}
				</div>

				<div
					class="w-full grid grid-cols-4 gap-4 p-2 mt-4 justify-items-center rounded border border-gray-450"
				>
					{#each lahan as lahanNow, idx}
						<label class="grid justify-items-center">
							<input
								type="checkbox"
								bind:checked={cekLahan2[idx]}
								on:change={() => lahan2Click(idx)}
							/>
							<div class="text-xs"><small>{lahanNow}</small></div>
						</label>
					{/each}
				</div>
			</div>
		{:else if showjadwal === 3}
			<!-- jadwal 3-->
			<div class="grid justify-items-center border-1">
				<div class="w-full text-center font-bold">Jadwal 3</div>
				<div class="w-full grid grid-cols-3 gap-2 mt-4">
					<div class="border rounded border-emerald-950">
						<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
							Waktu
						</div>
						<SveltyPicker
							bind:value={waktuSiram3}
							inputClasses="w-3/4 font-bold text-lg text-center mx-4"
							placeholder="06:30"
							format="hh:ii"
							displayFormat="hh:ii "
						/>
					</div>
					<label class=" border rounded border-emerald-950">
						<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
							Durasi <b>{durasiSiram3}</b> menit
						</div>
						<div class="grid justify-items-center">
							<input
								class="w-3/4 h-2 my-4"
								type="range"
								bind:value={durasiSiram3}
								min="1"
								max="15"
							/>
						</div>
					</label>
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
				</div>
				<!-- hari-->

				<div
					class="w-full p-2 grid grid-cols-7 gap-4 mt-4 justify-items-center border border-gray-300 rounded"
				>
					{#each hari as hariNow, idx}
						<label class="text-xs">
							<div><small>{hariNow}</small></div>
							<input
								type="checkbox"
								bind:checked={cekHari3[idx]}
								on:change={() => pilihanHari3Click(idx)}
							/>
						</label>
					{/each}
				</div>

				<div
					class="w-full grid grid-cols-4 gap-4 p-2 mt-4 justify-items-center rounded border border-gray-450"
				>
					{#each lahan as lahanNow, idx}
						<label class="grid justify-items-center">
							<input
								type="checkbox"
								bind:checked={cekLahan3[idx]}
								on:change={() => lahan3Click(idx)}
							/>
							<div class="text-xs"><small>{lahanNow}</small></div>
						</label>
					{/each}
				</div>
			</div>
		{:else if showjadwal === 4}
			<!-- jadwal 4-->
			<div class="grid justify-items-center border-1">
				<div class="w-full text-center font-bold">Jadwal 4</div>
				<div class="w-full grid grid-cols-3 gap-2 mt-4">
					<div class="border rounded border-emerald-950">
						<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
							Waktu
						</div>
						<SveltyPicker
							bind:value={waktuSiram4}
							inputClasses="w-3/4 font-bold text-lg text-center mx-4"
							placeholder="06:30"
							format="hh:ii"
							displayFormat="hh:ii "
						/>
					</div>
					<label class=" border rounded border-emerald-950">
						<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
							Durasi <b>{durasiSiram4}</b> menit
						</div>
						<div class="grid justify-items-center">
							<input
								class="w-3/4 h-2 my-4"
								type="range"
								bind:value={durasiSiram4}
								min="1"
								max="15"
							/>
						</div>
					</label>
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
				</div>
				<!-- hari-->

				<div
					class="w-full p-2 grid grid-cols-7 gap-4 mt-4 justify-items-center border border-gray-300 rounded"
				>
					{#each hari as hariNow, idx}
						<label class="text-xs">
							<div><small>{hariNow}</small></div>
							<input
								type="checkbox"
								bind:checked={cekHari4[idx]}
								on:change={() => pilihanHari4Click(idx)}
							/>
						</label>
					{/each}
				</div>

				<div
					class="w-full grid grid-cols-4 gap-4 p-2 mt-4 justify-items-center rounded border border-gray-450"
				>
					{#each lahan as lahanNow, idx}
						<label class="grid justify-items-center">
							<input
								type="checkbox"
								bind:checked={cekLahan4[idx]}
								on:change={() => lahan4Click(idx)}
							/>
							<div class="text-xs"><small>{lahanNow}</small></div>
						</label>
					{/each}
				</div>
			</div>
		{:else if showjadwal === 5}
			<!--jadwal 5-->
			<div class="grid justify-items-center border-1">
				<div class="w-full text-center font-bold">Jadwal 5</div>
				<div class="w-full grid grid-cols-3 gap-2 mt-4">
					<div class="border rounded border-emerald-950">
						<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
							Waktu
						</div>
						<SveltyPicker
							bind:value={waktuSiram5}
							inputClasses="w-3/4 font-bold text-lg text-center mx-4"
							placeholder="06:30"
							format="hh:ii"
							displayFormat="hh:ii "
						/>
					</div>
					<label class=" border rounded border-emerald-950">
						<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
							Durasi <b>{durasiSiram5}</b> menit
						</div>
						<div class="grid justify-items-center">
							<input
								class="w-3/4 h-2 my-4"
								type="range"
								bind:value={durasiSiram5}
								min="1"
								max="15"
							/>
						</div>
					</label>
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
				</div>
				<!-- hari-->

				<div
					class="w-full p-2 grid grid-cols-7 gap-4 mt-4 justify-items-center border border-gray-300 rounded"
				>
					{#each hari as hariNow, idx}
						<label class="text-xs">
							<div><small>{hariNow}</small></div>
							<input
								type="checkbox"
								bind:checked={cekHari5[idx]}
								on:change={() => pilihanHari5Click(idx)}
							/>
						</label>
					{/each}
				</div>

				<div
					class="w-full grid grid-cols-4 gap-4 p-2 mt-4 justify-items-center rounded border border-gray-450"
				>
					{#each lahan as lahanNow, idx}
						<label class="grid justify-items-center">
							<input
								type="checkbox"
								bind:checked={cekLahan5[idx]}
								on:change={() => lahan5Click(idx)}
							/>
							<div class="text-xs"><small>{lahanNow}</small></div>
						</label>
					{/each}
				</div>
			</div>
		{/if}
		{#if showjadwal !== 0}
			<div class="grid justify-items-center">
				<button
					on:click={() => simpanJadwalSiram()}
					class="w-1/2 h-12 border rounded-lg bg-green-900 text-white mt-4 mb-4"
					>Simpan Jadwal</button
				>
			</div>
		{/if}
	{:else if showMode === 2}
		<h3 class="text-xl font-bold text-center">Set Durasi Siram Manual</h3>
		<hr />
		<div class="grid grid-cols-3 my-4 justify-items-center">
			<input
				type="range"
				min="2"
				max="15"
				bind:value={$durasiManual}
				on:change={() => simpanDurasi()}
				class="range range-warning col-span-2"
			/>

			<div class="text-center">
				{$durasiManual} Menit
			</div>
		</div>
	{:else if showMode === 3}
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
		{:else if alertType === 5}<!--Hari-->
			<div class="text-center w-full">Jadwal Siram disimpan</div>
		{/if}
	{/if}
</Modal>

<style>
	.bg_siram {
		background-image: url('/bg_siram.png');
		background-position: center;
		background-size: cover;
	}
	.hd_siram1 {
		background-image: url('/hd_siram1.png');
		background-position: center;
		background-size: cover;
	}
</style>
