<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { kirimMsg } from '$lib/mqttHandle';
	import {
		lahan1Biopest_status,
		lahan2Biopest_status,
		lahan3Biopest_status,
		lahan4Biopest_status,
		dosisAirBiopest,
		dosisBiopest,
		biopest_status,
		firtLoad,
		jadwalBiopest,
		newJadwalBiopest,
		volumeAir,
		resetAllValue,
		runMode,
		demoMode,
		conect_status
	} from '$lib/store/stores';
	import Modal from '$lib/Modal.svelte';
	import SveltyPicker from 'svelty-picker';

	let showjadwal = 0;
	let showMode = 0;
	let dosisAirBiopest1 = 1;
	let dosisBiopest1 = 1;
	let dosisAirBiopest2 = 1;
	let dosisBiopest2 = 1;
	let dosisAirBiopest3 = 1;
	let dosisBiopest3 = 1;

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

	onMount(() => {
		resetAllValue();
		if ($firtLoad) {
			goto('/');
		}
		//if($newJadwalPestisida){
		if ($jadwalBiopest.length === 120) {
			console.log('jadwal len: ' + $jadwalBiopest.length);
			loadJadwal();
		}
		getAllStatus();
		showjadwal = 0;
		//	newJadwalPestisida.set(false);
		//}
	});

	function getAllStatus() {
		kirimMsg('kontrol', 0, 'getAllStatus', '0');
	}

	function semprotBiopest(lahan) {
		let msg = '0';
		if ($runMode === 0 || $runMode === 3) {
			runMode.set(3);
			if (lahan === 0) {
				if ($biopest_status) {
					msg = '1';

					$lahan1Biopest_status = true;
					$lahan2Biopest_status = true;
					$lahan3Biopest_status = true;
					$lahan4Biopest_status = true;
				} else {
					msg = '0';
					$lahan1Biopest_status = false;
					$lahan2Biopest_status = false;
					$lahan3Biopest_status = false;
					$lahan4Biopest_status = false;
				}
			} else if (lahan === 1) {
				if ($lahan1Biopest_status) {
					msg = '1';
					$biopest_status = true;
				} else {
					msg = '0';
					if (!$lahan2Biopest_status && !$lahan3Biopest_status && !$lahan4Biopest_status) {
						$biopest_status = false;
					}
				}
			} else if (lahan === 2) {
				if ($lahan2Biopest_status) {
					msg = '1';
					$biopest_status = true;
				} else {
					msg = '0';
					if (!$lahan1Biopest_status && !$lahan3Biopest_status && !$lahan4Biopest_status) {
						$biopest_status = false;
					}
				}
			} else if (lahan === 3) {
				if ($lahan3Biopest_status) {
					msg = '1';
					$biopest_status = true;
				} else {
					msg = '0';
					if (!$lahan2Biopest_status && !$lahan1Biopest_status && !$lahan4Biopest_status) {
						$biopest_status = false;
					}
				}
			} else if (lahan === 4) {
				if ($lahan4Biopest_status) {
					msg = '1';
					$biopest_status = true;
				} else {
					msg = '0';
					if (!$lahan2Biopest_status && !$lahan3Biopest_status && !$lahan1Biopest_status) {
						$biopest_status = false;
					}
				}
			}
			//if (readySend) {
			if (!$demoMode) {
				kirimMsg('biopest', lahan, 'cmd', msg);
			} else {
				alertDemo();
				$lahan1Biopest_status = false;
				$lahan2Biopest_status = false;
				$lahan3Biopest_status = false;
				$lahan4Biopest_status = false;
				$biopest_status = false;
			}
		} else {
			//
			$lahan1Biopest_status = false;
			$lahan2Biopest_status = false;
			$lahan3Biopest_status = false;
			$lahan4Biopest_status = false;
			$biopest_status = false;
			alertShow($runMode);
		}
	}

	function alertDemo() {
		showModal = true;
		showMode = 4;
	}

	function alertShow(val) {
		showModal = true;
		showMode = 3;
	}

	function pilihLahanBiopest(lh) {
		let lahanSts = '0';
		if (lh === 1) {
			if ($lahan1Biopest_status) {
				lahanSts = '1';
			} else {
				lahanSts = '0';
			}
		} else if (lh === 2) {
			if ($lahan2Biopest_status) {
				lahanSts = '1';
			} else {
				lahanSts = '0';
			}
		} else if (lh === 3) {
			if ($lahan3Biopest_status) {
				lahanSts = '1';
			} else {
				lahanSts = '0';
			}
		} else if (lh === 4) {
			if ($lahan4Biopest_status) {
				lahanSts = '1';
			} else {
				lahanSts = '0';
			}
		}
		kirimMsg('biopest', lh, 'lahan', lahanSts);
	}

	function simpanDosisAirBiopest() {
		if(!$demoMode){
		kirimMsg('biopest', 0, 'dosisAirBiopest', String($dosisAirBiopest));
		}
	}
	function simpanDosisBiopest() {
		if(!$demoMode){
		kirimMsg('biopest', 0, 'dosisBiopest', String($dosisBiopest));
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
		jw += ',1,2,'; //kode 1 kode Biopest
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
		jw += String(dosisAirBiopest1);
		jw += ',';
		jw += String(dosisBiopest1);
		jw += ',0';
		jw += ';';

		//jadwal 2
		if (jadwal2Enable) {
			jw += '1';
		} else {
			jw += '0';
		}
		jw += ',2,2,'; //kode 0 siram
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
		jw += String(dosisAirBiopest2);
		jw += ',';
		jw += String(dosisBiopest2);
		jw += ',0';
		jw += ';';

		//jadwal 3
		if (jadwal3Enable) {
			jw += '1';
		} else {
			jw += '0';
		}
		jw += ',3,2,'; //
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
		jw += String(dosisAirBiopest3);
		jw += ',';
		jw += String(dosisBiopest3);
		jw += ',0';
		jw += ';';
		return jw;
	}
	function simpanJadwalBiopest(idxJadwal) {
		//cek pilihan lahan dan hari
		showMode = 1;
		showjadwal = 0;
		if($demoMode){
			alertDemo()
		}else{

		let jwl = packingJadwal();
		kirimMsg('biopest', 0, 'setJadwal', jwl);
		//console.log(jwl);
		}
	}

	function loadJadwal() {
		//format
		//enable,idx,jenis,H,M,s,s,r,k,j,s,m,l1,l2,l3,l4,A,P,T;enable,idx,jenis,H,M,s,s,r,k,j,s,m,l1,l2,l3,l4,A,P,T;enable,idx,jenis,H,M,s,s,r,k,j,s,m,l1,l2,l3,l4,A,P,T

		let jadwal123 = $jadwalBiopest.split(';');
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
		dosisAirBiopest1 = parseInt(jadwal1[16]);
		dosisBiopest1 = parseInt(jadwal1[17]);
		//durasiSiram1 = jadwal1[18];
		//jadwal2
		let jadwal2 = jadwal123[1].split(',');
		if (jadwal2[0] === '1') {
			jadwal2Enable = true;
		} else {
			jadwal2Enable = false;
		}
		waktuSemprot2 = jadwal1[3] + ':';
		waktuSemprot2 += jadwal1[4];
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
		dosisAirBiopest2 = parseInt(jadwal2[16]);
		dosisBiopest2 = parseInt(jadwal2[17]);
		//durasiSiram2 = jadwal1[18];
		//jadwal3
		let jadwal3 = jadwal123[2].split(',');
		if (jadwal3[0] === '1') {
			jadwal3Enable = true;
		} else {
			jadwal3Enable = false;
		}
		waktuSemprot3 = jadwal1[3] + ':';
		waktuSemprot3 += jadwal1[4];
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
		dosisAirBiopest3 = parseInt(jadwal3[16]);
		dosisBiopest3 = parseInt(jadwal3[17]);
		//durasiSiram3 = jadwal1[18];
	}

	function showJadwalBiopest() {
		showModal = true;
		showMode = 1;
		if ($newJadwalBiopest) {
			loadJadwal();
			newJadwalBiopest.set(false);
		}
	}
</script>

<div class="h-screen w-screen bg-zinc-800">
	<div class="bg_biopest h-full w-full max-w-md mx-auto flex flex-col">
		<div>
			<img src=" /hd_biopest1.png" alt="hd_biopest" />
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
				<div class="text-sm font-bold text-center mt-2">DOSIS BIOPESTISIDA</div>
				<div class="grid grid-cols-2 gap-4 h-20 px-6 mt-4">
					<label class=" border rounded border-emerald-950">
						<div class="text-center bg-red-100 rounded rounded-bl-none rounded-br-none">Air</div>
						<div class="grid justify-items-center">
							<div>
								<input
									class="text-center text-xl w-1/2 font-bold"
									type="number"
									bind:value={$dosisAirBiopest}
									on:change={() => simpanDosisAirBiopest()}
									min="1"
									max="20"
								/>
								<span class="text-xs">Liter</span>
							</div>
							<input
								class="w-3/4 h-2 mt-2"
								type="range"
								on:change={() => simpanDosisAirBiopest()}
								bind:value={$dosisAirBiopest}
								min="1"
								max="20"
							/>
						</div>
					</label>

					<label class=" border rounded border-emerald-950">
						<div class="text-center bg-red-100 rounded rounded-bl-none rounded-br-none">
							Biopestisida
						</div>
						<div class="grid justify-items-center">
							<div>
								<input
									class="text-center text-xl w-1/2 font-bold"
									type="number"
									bind:value={$dosisBiopest}
									on:change={() => simpanDosisBiopest()}
									min="1"
									max="100"
								/>
								<span class="text-xs">mL</span>
							</div>
							<input
								class="w-3/4 h-2 mt-2"
								type="range"
								bind:value={$dosisBiopest}
								on:change={() => simpanDosisBiopest()}
								min="1"
								max="100"
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
							bind:checked={$lahan1Biopest_status}
							on:change={() => semprotBiopest(1)}
						/></label
					>

					<label class="text-xs font-bold text-center"
						><small>Lahan2</small>
						<input
							type="checkbox"
							class="toggle toggle-accent"
							bind:checked={$lahan2Biopest_status}
							on:change={() => semprotBiopest(2)}
						/></label
					>
					<label class="text-xs font-bold text-center"
						><small>Lahan3</small>
						<input
							type="checkbox"
							class="toggle toggle-accent"
							bind:checked={$lahan3Biopest_status}
							on:change={() => semprotBiopest(3)}
						/></label
					>
					<label class="text-xs font-bold text-center"
						><small>Lahan4</small>
						<input
							type="checkbox"
							class="toggle toggle-accent"
							bind:checked={$lahan4Biopest_status}
							on:change={() => semprotBiopest(4)}
						/></label
					>
				</div>

				<!-- kontrol pestisida-->
				<div class="grid grid-cols-3 w-full h-24 my-4 justify-items-center">
					<div class="text-sm font-bold text-center"><small>Jadwal</small></div>
					<div></div>
					<div class="text-sm font-bold mb-0"><small>Semprot</small></div>
					<button
						on:click={() => showJadwalBiopest()}
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
						<div class="text-center font-bold text-lg">{$volumeAir} Ltr</div>
					</div>

					<label class="swap swap-flip h-16 w-16">
						<!-- this hidden checkbox controls the state -->
						<input
							type="checkbox"
							bind:checked={$biopest_status}
							on:change={() => semprotBiopest(0)}
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
			<button on:click={() => goto('/')}>
				<img class="h-8 w-8" src="/logout.png" alt="btn_out" />
			</button>
			<div class="col-span-3"></div>
			<button on:click={() => goto('/home')}>
				<img class="h-8 w-8" src="/btn_home2.png" alt="btn_home" />
			</button>
		</div>
	</div>
</div>
<!--Jadwal-->
<Modal bind:showModal>
	{#if showMode === 1}
		<h3 class="text-xl font-bold text-center">Jadwal Biopestisida</h3>
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
										bind:value={dosisAirBiopest1}
										min="1"
										max="20"
									/>
								</div>
								<input
									class="w-3/4 h-2 mt-2"
									type="range"
									bind:value={dosisAirBiopest1}
									min="1"
									max="20"
								/>
							</div>
						</label>
						<label class=" border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Biopestisida(mL)
							</div>
							<div class="grid justify-items-center mb-2">
								<div>
									<input
										class="text-center text-l w-full font-bold"
										type="number"
										bind:value={dosisBiopest1}
										min="1"
										max="50"
									/>
								</div>
								<input
									class="w-3/4 h-2 mt-2"
									type="range"
									bind:value={dosisBiopest1}
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
										bind:value={dosisAirBiopest2}
										min="1"
										max="20"
									/>
								</div>
								<input
									class="w-3/4 h-2 mt-2"
									type="range"
									bind:value={dosisAirBiopest2}
									min="1"
									max="20"
								/>
							</div>
						</label>
						<label class=" border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Biopestisida(mL)
							</div>
							<div class="grid justify-items-center mb-2">
								<div>
									<input
										class="text-center text-l w-full font-bold"
										type="number"
										bind:value={dosisBiopest2}
										min="1"
										max="50"
									/>
								</div>
								<input
									class="w-3/4 h-2 mt-2"
									type="range"
									bind:value={dosisBiopest2}
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
										bind:value={dosisAirBiopest3}
										min="1"
										max="20"
									/>
								</div>
								<input
									class="w-3/4 h-2 mt-2"
									type="range"
									bind:value={dosisAirBiopest3}
									min="1"
									max="20"
								/>
							</div>
						</label>
						<label class=" border rounded border-emerald-950">
							<div class="text-center text-xs bg-red-100 rounded rounded-bl-none rounded-br-none">
								Biopestisida(mL)
							</div>
							<div class="grid justify-items-center mb-2">
								<div>
									<input
										class="text-center text-l w-full font-bold"
										type="number"
										bind:value={dosisBiopest3}
										min="1"
										max="50"
									/>
								</div>
								<input
									class="w-3/4 h-2 mt-2"
									type="range"
									bind:value={dosisBiopest3}
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
						simpanJadwalBiopest();
					}}
					class="w-1/2 h-12 border rounded-lg bg-green-900 text-white mt-4 mb-4"
					>Simpan Jadwal</button
				>
			</div>
		{/if}
	{:else if showMode === 2}
		<div></div>
	{:else if showMode === 3}
		<!-- alert-->
		<h3 class="text-xl font-bold text-center text-red-500">!!! Perhatian !!!</h3>
		<hr />
		{#if $runMode === 1}
			<div>Sedang Penyiraman</div>
		{:else if $runMode === 2}
			<div>Sedang Penyemprotan Pestisida</div>
		{:else if $runMode === 3}
			<div>Sedang Penyemproten Biopest</div>
		{/if}
	{:else if showMode === 4}
		<div>
			<h3 class="text-xl font-bold text-center text-red-500">!!! Perhatian !!!</h3>
			<hr />
			<div class="text-center w-full">Fungsi ini tidak berjalan di mode Demo</div>
		</div>
	{/if}
</Modal>

<style>
	.bg_biopest {
		background-image: url('/bg_biopest.png');
		background-size: cover;
		background-position: center;
	}
</style>
