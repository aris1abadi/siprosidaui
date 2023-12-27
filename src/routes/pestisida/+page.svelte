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
		conect_status
	} from '$lib/store/stores';
	import Modal from '$lib/Modal.svelte';
	import SveltyPicker from 'svelty-picker';

	let showjadwal = 0;
	let showMode = 0;
	let dosisAirPestisida1 = 1;
	let dosisPestisida1 = 1;
	let dosisAirPestisida2 = 1;
	let dosisPestisida2 = 1;
	let dosisAirPestisida3 = 1;
	let dosisPestisida3 = 1;

	let jadwal1Enable = false;
	let jadwal2Enable = false;
	let jadwal3Enable = false;
	let waktuSemprot1 = '06:00';
	let waktuSemprot2 = '06:00';
	let waktuSemprot3 = '06:00';

	let hari = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
	let lahan = ['Lahan 1', 'Lahan 2', 'Lahan 3', 'Lahan 4'];
	let pilihanHari1 = [0, 0, 0, 0, 0, 0, 0];
	let pilihanHari2 = [0, 0, 0, 0, 0, 0, 0];
	let pilihanHari3 = [0, 0, 0, 0, 0, 0, 0];
	let cekHari1 = [false, false, false, false, false, false, false];
	let cekHari2 = [false, false, false, false, false, false, false];
	let cekHari3 = [false, false, false, false, false, false, false];

	let pilihanLahan1 = [0, 0, 0, 0];
	let pilihanLahan2 = [0, 0, 0, 0];
	let pilihanLahan3 = [0, 0, 0, 0];
	let cekLahan1 = [false, false, false, false];
	let cekLahan2 = [false, false, false, false];
	let cekLahan3 = [false, false, false, false];

	let showModal = false;
	let faktorKalibrasi = 10;
	let alertType = 0;

	onMount(() => {
		resetAllValue();
		if ($firtLoad) {
			goto('/');
		}
		//if($newJadwalPestisida){
		if ($jadwalPestisida.length === 120) {
			console.log('jadwal len: ' + $jadwalPestisida.length);
			loadJadwal();
		}
		getAllStatus();
		showjadwal = 0;
		//	newJadwalPestisida.set(false);
		//}
	});

	function getAllStatus() {
		kirimMsg('pestisida', 0, 'getStatus', '0');
	}

	function semprotPestisida(lahan) {
		let msg = '0';
		if ($conect_status) {
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
	}
	function alertConect() {
		showModal = true;
		showMode = 3;
		alertType = 2;
	}
	function alertLahan() {
		showModal = true;
		showMode = 3;
		alertType = 3;
	}
	function alertHari() {
		showModal = true;
		showMode = 3;
		alertType = 4;
	}
	function alertSimpanJadwal() {
		showModal = true;
		showMode = 3;
		alertType = 5;
	}

	function alertShow(val) {
		showModal = true;
		showMode = val;
		alertType = 0;
	}

	function simpanDosisAirPestisida() {
		if (!$demoMode) {
			if ($conect_status) {
				kirimMsg('pestisida', 0, 'dosisAirPestisida', String($dosisAirPestisida));
			} else {
				alertConect();
			}
		} else {
			alertDemo();
		}
	}
	function simpanDosisPestisida() {
		if (!$demoMode) {
			if ($conect_status) {
				kirimMsg('pestisida', 0, 'dosisPestisida', String($dosisPestisida));
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
	}

	function showJadwalPestisida() {
		showModal = true;
		showMode = 1;
		if ($newJadwalPestisida) {
			loadJadwal();
			newJadwalPestisida.set(false);
		}
	}
	function pilihLahanPestisida(lh) {
		let lahanSts = '0';
		if (lh === 1) {
			if ($lahan1Pestisida_status) {
				lahanSts = '1';
			} else {
				lahanSts = '0';
			}
		} else if (lh === 2) {
			if ($lahan2Pestisida_status) {
				lahanSts = '1';
			} else {
				lahanSts = '0';
			}
		} else if (lh === 3) {
			if ($lahan3Pestisida_status) {
				lahanSts = '1';
			} else {
				lahanSts = '0';
			}
		} else if (lh === 4) {
			if ($lahan4Pestisida_status) {
				lahanSts = '1';
			} else {
				lahanSts = '0';
			}
		}
		kirimMsg('pestisida', lh, 'lahan', lahanSts);
	}

	function kalibrasiPestisida() {
		showMode = 2;
		showModal = true;
	}

	function kalibrasiStart() {
		if (!$demoMode) {
			if ($conect_status) {
				kirimMsg('pestisida', 0, 'kalibrasi', String(faktorKalibrasi));
			} else {
				alertConect();
			}
		} else {
			alertDemo();
		}
	}

	function simpanKalibrasi(val) {
		if (!$demoMode) {
			if ($conect_status) {
				kirimMsg('pestisida', 0, 'simpanKalibrasi', String(val));
			} else {
				alertConect();
			}
		} else {
			alertDemo();
		}
	}
</script>

<div class="h-screen w-screen bg-zinc-800">
	<div class="bg_pestisida h-full w-full max-w-md mx-auto flex flex-col">
		<div>
			<img src=" /hd_pestisida1.png" alt="hd_pestisida" />
		</div>
		<div class="w-full h-4 grid justify-items-center my-2">
			{#if $demoMode}
				<div class="text-center text-xs bg-red-500 text-white w-12 h-4"><small>Demo</small></div>
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

		<div class="grid grid-cols-12 w-full h-1/2">
			<div></div>
			<div class="col-span-10 bg-white rounded-lg shadow-xl">
				<div class="text-sm font-bold text-center mt-2">DOSIS PESTISIDA</div>
				<div class="grid grid-cols-2 gap-4 h-20 px-6 mt-4">
					<label class=" border rounded border-emerald-950">
						<div class="text-center bg-red-100 rounded rounded-bl-none rounded-br-none">Air</div>
						<div class="grid justify-items-center">
							<div>
								<input
									class="text-center text-xl w-1/2 font-bold"
									type="number"
									bind:value={$dosisAirPestisida}
									on:change={() => simpanDosisAirPestisida()}
									min="1"
									max="20"
								/>
								<span class="text-xs">Liter</span>
							</div>
							<input
								class="w-3/4 h-2 mt-2"
								type="range"
								bind:value={$dosisAirPestisida}
								on:change={() => simpanDosisAirPestisida()}
								min="1"
								max="20"
							/>
						</div>
					</label>
					<label class=" border rounded border-emerald-950">
						<div class="text-center bg-red-100 rounded rounded-bl-none rounded-br-none">
							Pestisida
						</div>
						<div class="grid justify-items-center">
							<div>
								<input
									class="text-center text-xl w-1/2 font-bold"
									type="number"
									bind:value={$dosisPestisida}
									on:change={() => simpanDosisPestisida()}
									min="1"
									max="50"
								/>
								<span class="text-xs">mL</span>
							</div>
							<input
								class="w-3/4 h-2 mt-2"
								type="range"
								bind:value={$dosisPestisida}
								on:change={() => simpanDosisPestisida()}
								min="1"
								max="50"
							/>
						</div>
					</label>
				</div>

				<div class="grid grid-cols-4 gap-2 mt-4 px-4">
					<label class="text-xs font-bold text-center"
						><small>Lahan1</small>
						<input
							type="checkbox"
							class="toggle toggle-accent"
							bind:checked={$lahan1Pestisida_status}
							on:change={() => semprotPestisida(1)}
						/></label
					>

					<label class="text-xs font-bold text-center"
						><small>Lahan2</small>
						<input
							type="checkbox"
							class="toggle toggle-accent"
							bind:checked={$lahan2Pestisida_status}
							on:change={() => semprotPestisida(2)}
						/></label
					>
					<label class="text-xs font-bold text-center"
						><small>Lahan3</small>
						<input
							type="checkbox"
							class="toggle toggle-accent"
							bind:checked={$lahan3Pestisida_status}
							on:change={() => semprotPestisida(3)}
						/></label
					>
					<label class="text-xs font-bold text-center"
						><small>Lahan4</small>
						<input
							type="checkbox"
							class="toggle toggle-accent"
							bind:checked={$lahan4Pestisida_status}
							on:change={() => semprotPestisida(4)}
						/></label
					>
				</div>
				<!-- kontrol pestisida-->
				<div class="grid grid-cols-3 w-full h-24 my-4 justify-items-center">
					<div class="text-sm font-bold text-center"><small>Jadwal</small></div>
					<div></div>
					<div class="text-sm font-bold mb-0"><small>Semprot</small></div>
					<button
						on:click={() => showJadwalPestisida()}
						class="w-3/4 h-16 rounded-lg shadow-lg border border-gray-900"
					>
						<div class="grid grid-cols-2 gap-1">
							<div>
								<div class="text-xs text-black-300">
									<small>
										{#if jadwal1Enable}
											{waktuSemprot1}
										{:else}
											--:--
										{/if}
									</small>
								</div>
								<div class="text-xs text-black-300">
									<small>
										{#if jadwal2Enable}
											{waktuSemprot2}
										{:else}
											--:--
										{/if}
									</small>
								</div>
								<div class="text-xs text-black-300">
									<small>
										{#if jadwal3Enable}
											{waktuSemprot3}
										{:else}
											--:--
										{/if}
									</small>
								</div>
							</div>
							<div class="grid justify-items-center">
								<img class="w-3/4 h-3/4 mt-2" src="/jadwal.png" alt="btn" />
							</div>
						</div>

						<!--<img src=" /jadwal.png" alt="btn" /> -->
					</button>
					<!--volume air-->
					<div class=" w-3/4 h-16 border rounded">
						<div class="mt-1 text-center text-sm"></div>
						<div class="text-center font-bold text-lg">{$volumeAir} <small>Ltr</small></div>
						<hr />
						<button on:click={() => kalibrasiPestisida()} class="grid justify-items-center w-full">
							<img class="w-6 h-6" src="/setup.png" alt="kalibrasi" />
						</button>
					</div>

					<label class="swap swap-flip h-16 w-16">
						<!-- this hidden checkbox controls the state -->
						<input
							type="checkbox"
							bind:checked={$pestisida_status}
							on:change={() => semprotPestisida(0)}
						/>
						<div class="swap-on">
							<img class="ml-1" src=" /btnhijau.jpeg" alt="btn_on" />
						</div>
						<div class="swap-off">
							<img class="ml-1" src=" /btnmerah.jpeg" alt="btn_off" />
						</div>
					</label>
				</div>
			</div>
			<div></div>
		</div>
		<div class="grid grid-cols-5 w-full h-12 justify-items-center mt-16">
			<button class="grid justify-items-center" on:click={() => goto('/')}>
				<img class="h-8 w-8" src="/logout.png" alt="log out" />
				<div>Logout</div>
			</button>
			<div class="col-span-2"></div>
			{#if !$demoMode}
				<button class="grid justify-items-center" on:click={() => goto('/tes')}>
					<img class="h-8 w-8" src="/setup.png" alt="btn_setupout" />
					<div>Setup</div>
				</button>
			{:else}
				<div></div>
			{/if}
			<button class="grid justify-items-center" on:click={() => goto('/home')}>
				<img class="h-8 w-8" src="/btn_home2.png" alt="go home" />
				<div>Home</div>
			</button>
		</div>
	</div>
</div>

<!--Jadwal-->
<Modal bind:showModal>
	{#if showMode === 1}<!--mode jadwal-->
		<h3 class="text-xl font-bold text-center">Jadwal Pestisida</h3>
		<hr />

		<div class="grid grid-cols-3 gap-4 w-full my-4">
			<button
				class={jadwal1Enable
					? 'border rounded h-12 font-bold bg-green-700 text-white'
					: 'border rounded h-12 font-bold bg-green-100 text-black'}
				on:click={() => (showjadwal = 1)}
				><div class="text-xs"><small>Jadwal1</small></div>
				{waktuSemprot1}
			</button>
			<button
				class={jadwal2Enable
					? 'border rounded h-12 font-bold bg-green-700 text-white'
					: 'border rounded h-12 font-bold bg-green-100 text-black'}
				on:click={() => (showjadwal = 2)}
				><div class="text-xs"><small>Jadwal2</small></div>
				{waktuSemprot2}
			</button>
			<button
				class={jadwal3Enable
					? 'border rounded h-12 font-bold bg-green-700 text-white'
					: 'border rounded h-12 font-bold bg-green-100 text-black'}
				on:click={() => (showjadwal = 3)}
				><div class="text-xs"><small>Jadwal3</small></div>
				{waktuSemprot3}
			</button>
		</div>
		<!-- jadwal 1-->
		{#if showjadwal === 1}
			<div
				class="grid grid-cols-10 gap-2 mt-4 justify-items-center border rounded-lg border-1 shadow-xl"
			>
				<div class=" col-span-10 text-center">Jadwal 1</div>
				<!--waktu dan dosis-->
				<div class="col-span-10 h-20 mt-2">
					<div class="grid grid-cols-3 gap-2 px-2 justify-items-center">
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
						<label class=" border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Air(liter)
							</div>
							<div class="grid justify-items-center mb-2">
								<div>
									<input
										class="text-center text-l w-full font-bold"
										type="number"
										bind:value={dosisAirPestisida1}
										min="1"
										max="20"
									/>
								</div>
								<input
									class="w-3/4 h-2 mt-2"
									type="range"
									bind:value={dosisAirPestisida1}
									min="1"
									max="20"
								/>
							</div>
						</label>
						<label class=" border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Pestisida(mL)
							</div>
							<div class="grid justify-items-center mb-2">
								<div>
									<input
										class="text-center text-l w-full font-bold"
										type="number"
										bind:value={dosisPestisida1}
										min="1"
										max="50"
									/>
								</div>
								<input
									class="w-3/4 h-2 mt-2"
									type="range"
									bind:value={dosisPestisida1}
									min="1"
									max="50"
								/>
							</div>
						</label>
					</div>
				</div>
				<!--button enable-->
				<div class="col-span-2">
					<input
						type="checkbox"
						class="ml-4 mt-1 toggle toggle-primary"
						bind:checked={jadwal1Enable}
					/>
				</div>
				<!-- hari-->
				<div class="col-span-8 text-xs">
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

				<div class="col-span-2"></div>

				<div class="col-span-8 text-xs border mb-2 px-2">
					<div class="grid grid-cols-4 gap-4 p-2 justify-items-center">
						{#each lahan as lahanNow, idx}
							<label>
								<input
									type="checkbox"
									bind:checked={cekLahan1[idx]}
									on:change={() => lahan1Click(idx)}
								/>
								<small>{lahanNow}</small>
							</label>
						{/each}
					</div>
				</div>
			</div>

			<!-- jadwal 2-->
		{:else if showjadwal === 2}
			<div
				class="grid grid-cols-10 gap-2 mt-4 justify-items-center border rounded-lg border-1 shadow-xl"
			>
				<div class=" col-span-10 text-center">Jadwal 2</div>
				<!--waktu dan dosis-->
				<div class="col-span-10 h-20 mt-2">
					<div class="grid grid-cols-3 gap-2 px-2 justify-items-center">
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
						<label class=" border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Air(liter)
							</div>
							<div class="grid justify-items-center mb-2">
								<div>
									<input
										class="text-center text-l w-full font-bold"
										type="number"
										bind:value={dosisAirPestisida2}
										min="1"
										max="20"
									/>
								</div>
								<input
									class="w-3/4 h-2 mt-2"
									type="range"
									bind:value={dosisAirPestisida2}
									min="1"
									max="20"
								/>
							</div>
						</label>
						<label class=" border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Pestisida(mL)
							</div>
							<div class="grid justify-items-center mb-2">
								<div>
									<input
										class="text-center text-l w-full font-bold"
										type="number"
										bind:value={dosisPestisida2}
										min="1"
										max="50"
									/>
								</div>
								<input
									class="w-3/4 h-2 mt-2"
									type="range"
									bind:value={dosisPestisida2}
									min="1"
									max="50"
								/>
							</div>
						</label>
					</div>
				</div>
				<!--button enable-->
				<div class="col-span-2">
					<input
						type="checkbox"
						class="ml-4 mt-1 toggle toggle-primary"
						bind:checked={jadwal2Enable}
					/>
				</div>
				<!-- hari-->
				<div class="col-span-8 text-xs">
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

				<div class="col-span-2"></div>

				<div class="col-span-8 text-xs border mb-2 px-2">
					<div class="grid grid-cols-4 gap-4 p-2 justify-items-center">
						{#each lahan as lahanNow, idx}
							<label>
								<input
									type="checkbox"
									bind:checked={cekLahan2[idx]}
									on:change={() => lahan2Click(idx)}
								/>
								<small>{lahanNow}</small>
							</label>
						{/each}
					</div>
				</div>
			</div>

			<!-- jadwal 3-->
		{:else if showjadwal === 3}
			<div
				class="grid grid-cols-10 gap-2 mt-4 justify-items-center border rounded-lg border-1 shadow-xl"
			>
				<div class=" col-span-10 text-center">Jadwal 3</div>
				<!--waktu dan dosis-->
				<div class="col-span-10 h-20 mt-2">
					<div class="grid grid-cols-3 gap-2 px-2 justify-items-center">
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
						<label class=" border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Air(liter)
							</div>
							<div class="grid justify-items-center mb-2">
								<div>
									<input
										class="text-center text-l w-full font-bold"
										type="number"
										bind:value={dosisAirPestisida3}
										min="1"
										max="20"
									/>
								</div>
								<input
									class="w-3/4 h-2 mt-2"
									type="range"
									bind:value={dosisAirPestisida3}
									min="1"
									max="20"
								/>
							</div>
						</label>
						<label class=" border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Pestisida(mL)
							</div>
							<div class="grid justify-items-center mb-2">
								<div>
									<input
										class="text-center text-l w-full font-bold"
										type="number"
										bind:value={dosisPestisida3}
										min="1"
										max="50"
									/>
								</div>
								<input
									class="w-3/4 h-2 mt-2"
									type="range"
									bind:value={dosisPestisida3}
									min="1"
									max="50"
								/>
							</div>
						</label>
					</div>
				</div>
				<!--button enable-->
				<div class="col-span-2">
					<input
						type="checkbox"
						class="ml-4 mt-1 toggle toggle-primary"
						bind:checked={jadwal3Enable}
					/>
				</div>
				<!-- hari-->
				<div class="col-span-8 text-xs">
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

				<div class="col-span-2"></div>

				<div class="col-span-8 text-xs border mb-2 px-2">
					<div class="grid grid-cols-4 gap-4 p-2 justify-items-center">
						{#each lahan as lahanNow, idx}
							<label>
								<input
									type="checkbox"
									bind:checked={cekLahan3[idx]}
									on:change={() => lahan3Click(idx)}
								/>
								<small>{lahanNow}</small>
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
	{:else if showMode === 2}<!--mode kalibrasi-->
		<div role="tablist" class="tabs tabs-lifted">
			<input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label="Info" />
			<div role="tabpanel" class="tab-content bg-base-100 border-base-300 p-2">
				<div class="w-full h-36"></div>
			</div>

			<input
				type="radio"
				name="my_tabs_2"
				role="tab"
				class="tab"
				aria-label="Kal pestisida"
				checked
			/>
			<div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-2">
				<div class="grid grid-cols-2 justify-items-center mt-4">
					<div class="col-span-2 mb-4">Kalibrasi pada Volume 10mL</div>
					<input bind:value={faktorKalibrasi} type="number" min="1" max="100" class="w-1/4 h-8" />
					<button on:click={() => kalibrasiStart()} class="btn btn-outline ml-4 w-3/4">Mulai</button
					>
					<button
						on:click={() => simpanKalibrasi(faktorKalibrasi)}
						class="btn btn-active btn-primary mt-6 col-span-2">Simpan kalibrasi</button
					>
				</div>
			</div>

			<input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label="Kal Air" />
			<div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-2">
				<div class="w-full h-36"></div>
			</div>
		</div>
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
		{/if}
	{/if}
</Modal>

<style>
	.bg_pestisida {
		background-image: url(' /bg_pestisida.png');
		background-size: cover;
		background-position: center;
	}

	input[type='number']::-webkit-inner-spin-button {
		opacity: 1;
	}
</style>
