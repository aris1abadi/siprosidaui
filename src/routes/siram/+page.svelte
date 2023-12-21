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
		conect_status
	} from '$lib/store/stores';

	import Modal from '$lib/Modal.svelte';
	import SveltyPicker from 'svelty-picker';
	import { tr } from 'svelty-picker/i18n';

	let showjadwal = 0;
	let showMode = 0; //1 = jadwal ,2 = set durasi,alert
	let jadwal1Enable = false;
	let jadwal2Enable = false;
	let jadwal3Enable = false;
	let durasiSiram1 = 5;
	let durasiSiram2 = 5;
	let durasiSiram3 = 5;
	let waktuSiram1 = '06:00';
	let waktuSiram2 = '06:00';
	let waktuSiram3 = '06:00';
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
		//if($newJadwalSiram){
		if ($jadwalSiram.length === 120) {
			//console.log('jadwal len: ' + $jadwalSiram.length);
			loadJadwal();
		}
		getAllStatus();
		//	newJadwalSiram.set(false);
		//}
		showjadwal = 0;
	});

	function getAllStatus() {
		kirimMsg('kontrol', 0, 'getAllStatus', '0');
	}

	function siramLahan(lahan) {
		let lahanSts = '0';
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
					//if (!$lahan2_status && !$lahan3_status && !$lahan4_status) {
					//	$siram_status = false;
					//}
				}
			} else if (lahan == 2) {
				if ($lahan2_status) {
					lahanSts = '1';
					$siram_status = true;
				} else {
					lahanSts = '0';
					//if (!$lahan1_status && !$lahan3_status && !$lahan4_status) {
					//	$siram_status = false;
					//}
				}
			} else if (lahan == 3) {
				if ($lahan3_status) {
					lahanSts = '1';
					$siram_status = true;
				} else {
					lahanSts = '0';
					//if (!$lahan2_status && !$lahan1_status && !$lahan4_status) {
					//	$siram_status = false;
					//}
				}
			} else if (lahan == 4) {
				if ($lahan4_status) {
					lahanSts = '1';
					$siram_status = true;
				} else {
					lahanSts = '0';
					//if (!$lahan2_status && !$lahan3_status && !$lahan1_status) {
					//	$siram_status = false;
					//}
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
	}

	function alertDemo() {
		showModal = true;
		showMode = 4;
	}

	function alertShow(val) {
		showModal = true;
		showMode = 3;
	}

	function setUseLengas() {
		let ln = '0';
		if ($useLengas) {
			console.log('pake lengas');
			ln = '1';
		} else {
			console.log('lengas off');
			ln = '0';
		}
		if (!$demoMode) {
			kirimMsg('siram', '0', 'useLengas', ln);
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

	function trigerLengasChange() {
		console.log('triger lengas: ' + $ambangLengas);
		if (!$demoMode) {
			kirimMsg('siram', '0', 'setAmbang', String($ambangLengas));
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

		return jw;
	}

	function simpanJadwalSiram() {
		if ($demoMode) {
			alertDemo();
		} else {
			showMode = 1;
			showjadwal = 0;
			let jwl = packingJadwal();
			//console.log(jwl);
			kirimMsg('siram', 0, 'setJadwal', jwl);
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
		durasiSiram3 = parseInt(jadwal1[18]);
		waktuSiram1 = waktuSiram1;
		waktuSiram2 = waktuSiram2;
		waktuSiram3 = waktuSiram3;
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
	}

	function simpanDurasi() {
		if (!$demoMode) {
			kirimMsg('siram', 0, 'setDurasi', String($durasiManual));
		}
	}
</script>

<div class="h-screen w-screen bg-zinc-800">
	<div class="bg_siram h-full w-full max-w-md mx-auto flex flex-col">
		<div>
			<img src=" /hd_siram1.png" alt="hd_siram" />
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

		<div class="grid grid-cols-9 content-center justify-center mt-6">
			<!--status lengas-->
			<div></div>
			<div class="w-12 h-12 bg-white rounded-lg shadow-xl">
				<div class="text-xs font-bold text-center"><small>Lengas1</small></div>
				<div class="text-l font-bold text-center">{$lengas1}%</div>
			</div>
			<div></div>
			<div class="w-12 h-12 bg-white rounded-lg shadow-xl">
				<div class="text-xs font-bold text-center"><small>Lengas2</small></div>
				<div class="text-l font-bold text-center">{$lengas2}%</div>
			</div>
			<div></div>
			<div class="w-12 h-12 bg-white rounded-lg shadow-xl">
				<div class="text-xs font-bold text-center"><small>Lengas3</small></div>
				<div class="text-l font-bold text-center">{$lengas3}%</div>
			</div>
			<div></div>
			<div class="w-12 h-12 bg-white rounded-lg shadow-xl">
				<div class="text-xs font-bold text-center"><small>Lengas4</small></div>
				<div class="text-l font-bold text-center">{$lengas4}%</div>
			</div>
			<div></div>
			<!-- lengas-->
			<div></div>
			<div class="col-span-7 w-full h-24 mt-4 bg-white rounded-md bg-opacity-70 shadow-lg">
				<div class="grid grid-cols-2 mt-2">
					<div class="w-full text-center text-xl">Set Lengas</div>
					<input
						class="text-center text-xl w-1/2 font-bold"
						type="number"
						bind:value={$ambangLengas}
						min="30"
						max="100"
					/>
				</div>

				<div class="grid grid-cols-8 mt-4">
					<div></div>
					<input
						type="checkbox"
						class="toggle toggle-accent"
						bind:checked={$useLengas}
						on:change={setUseLengas}
					/>
					<div></div>
					<input
						type="range"
						min="30"
						max="100"
						bind:value={$ambangLengas}
						on:change={() => trigerLengasChange()}
						class="range range-warning col-span-4"
					/>
				</div>
			</div>
			<div></div>
			<!--button siram lahan-->
			<div></div>
			<div class="col-span-7 w-full h-42 mt-4">
				<div class="w-full h-full bg-base-100 rounded-lg shadow-xl pt-1">
					<div class="grid grid-cols-4 gap-2 border border-red-900 mx-2 my-2">
						<label class="text-xs font-bold text-center"
							><small>Lahan1</small>
							<input
								type="checkbox"
								class="toggle toggle-accent"
								bind:checked={$lahan1_status}
								on:change={() => siramLahan(1)}
							/>
						</label>
						<label class="text-xs font-bold text-center"
							><small>Lahan2</small>
							<input
								type="checkbox"
								class="toggle toggle-accent"
								bind:checked={$lahan2_status}
								on:change={() => siramLahan(2)}
							/></label
						>
						<label class="text-xs font-bold text-center"
							><small>Lahan3</small>
							<input
								type="checkbox"
								class="toggle toggle-accent"
								bind:checked={$lahan3_status}
								on:change={() => siramLahan(3)}
							/></label
						>
						<label class="text-xs font-bold text-center"
							><small>Lahan4</small>
							<input
								type="checkbox"
								class="toggle toggle-accent"
								bind:checked={$lahan4_status}
								on:change={() => siramLahan(4)}
							/></label
						>
					</div>
					<!-- kontrol siram-->
					<div class="grid grid-cols-3 w-full h-24 my-4 justify-items-center">
						<div class="text-sm font-bold text-center"><small>Jadwal</small></div>
						<div></div>
						<div class="text-sm font-bold mb-0"><small>Siram Semua</small></div>
						<button
							on:click={() => showJadwalSiram()}
							class="w-3/4 h-16 rounded-lg shadow-lg border border-gray-900"
						>
							<div class="grid grid-cols-2 gap-1">
								<div>
									<div class="text-xs text-black-300">
										<small>
											{#if jadwal1Enable}
												{waktuSiram1}
											{:else}
												--:--
											{/if}
										</small>
									</div>
									<div class="text-xs text-black-300">
										<small>
											{#if jadwal2Enable}
												{waktuSiram2}
											{:else}
												--:--
											{/if}
										</small>
									</div>
									<div class="text-xs text-black-300">
										<small>
											{#if jadwal3Enable}
												{waktuSiram3}
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
						<!--volume air dan durasi-->
						<div class=" w-3/4 h-16">
							<button
								on:click={() => setDurasiClick()}
								class="text-xs text-center w-full h-6 mb-2 bg-green-200"
								><small>Durasi {$durasiManual} menit</small></button
							>
							<div class="h-8 bg-blue-200 pt-2">
								<div class="text-center text-xs font-bold">Air {$volumeAir} Ltr</div>
							</div>
						</div>
						<label class="swap swap-flip h-16 w-16">
							<!-- this hidden checkbox controls the state -->
							<input type="checkbox" bind:checked={$siram_status} on:change={() => siramLahan(0)} />
							<div class="swap-on">
								<img class="ml-1" src=" /btnhijau.jpeg" alt="btn_on" />
							</div>
							<div class="swap-off">
								<img class="ml-1" src=" /btnmerah.jpeg" alt="btn_off" />
							</div>
						</label>
					</div>
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

<!--pop up-->
<Modal bind:showModal>
	{#if showMode === 1}
		<h2 class="text-xl font-bold text-center">Jadwal Penyiraman</h2>
		<hr />
		<!--
	class={kategoriNow === kategori
					? "text-white bg-orange-500"
					: "text-black bg-white"}
-->
		<div class="grid grid-cols-3 gap-4 w-full my-4">
			<button
				class={jadwal1Enable
					? 'border rounded h-12 font-bold bg-green-700 text-white'
					: 'border rounded h-12 font-bold bg-green-100 text-black'}
				on:click={() => (showjadwal = 1)}
				><div class="text-xs"><small>Jadwal1</small></div>
				{waktuSiram1}
			</button>
			<button
				class={jadwal2Enable
					? 'border rounded h-12 font-bold bg-green-700 text-white'
					: 'border rounded h-12 font-bold bg-green-100 text-black'}
				on:click={() => (showjadwal = 2)}
				><div class="text-xs"><small>Jadwal2</small></div>
				{waktuSiram2}
			</button>
			<button
				class={jadwal3Enable
					? 'border rounded h-12 font-bold bg-green-700 text-white'
					: 'border rounded h-12 font-bold bg-green-100 text-black'}
				on:click={() => (showjadwal = 3)}
				><div class="text-xs"><small>Jadwal3</small></div>
				{waktuSiram3}
			</button>
		</div>
		{#if showjadwal === 1}
			<!-- jadwal 1-->
			<div
				class="grid grid-cols-10 gap-2 my-2 justify-items-center border rounded-lg border-1 bg-lime-100"
			>
				<!--waktu dan durasi-->
				<div class="col-span-10 text-center my-1">Jadwal 1</div>

				<div class="col-span-5 py-2">
					<div class="grid grid-cols-5 mt-1 justify-items-center">
						<div class="col-span-3 ml-2">
							<div class="text-center text-xs">Waktu</div>
							<SveltyPicker
								bind:value={waktuSiram1}
								inputClasses="w-20 font-bold text-2xl text-center bg-lime-100"
								placeholder={waktuSiram1}
								format="hh:ii"
								displayFormat="hh:ii "
							/>
							<input
								type="checkbox"
								class="ml-4 mt-2 toggle toggle-primary"
								bind:checked={jadwal1Enable}
							/>
						</div>
						<div class="col-span-2">
							<div class="text-center text-xs">Durasi</div>
							<div class="grid grid-cols-2">
								<input
									class="text-center text-2xl font-bold bg-lime-100"
									type="number"
									placeholder={String(durasiSiram1)}
									bind:value={durasiSiram1}
									min=1
									max=60
								/>
								<div class="text-xs">mnt</div>
							</div>
						</div>
					</div>
				</div>

				<div class="col-span-5 text-xs border border-white my-2 px-2">
					<div class="grid grid-cols-2 gap-4 p-2 justify-items-center">
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

				<!-- hari-->
				<div class="col-span-10 text-xs">
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
			</div>
		{:else if showjadwal === 2}
			<!-- jadwal 2-->
			<div
				class="grid grid-cols-10 gap-2 my-2 justify-items-center border rounded-lg border-1 bg-lime-100"
			>
				<!--waktu dan durasi-->
				<div class="col-span-10 text-center my-1">Jadwal 2</div>

				<div class="col-span-5 py-2">
					<div class="grid grid-cols-5 mt-1 justify-items-center">
						<div class="col-span-3 ml-2">
							<div class="text-center text-xs">Waktu</div>
							<SveltyPicker
								bind:value={waktuSiram2}
								inputClasses="w-20 font-bold text-2xl text-center bg-lime-100"
								placeholder={waktuSiram2}
								format="hh:ii"
								displayFormat="hh:ii "
							/>
							<input
								type="checkbox"
								class="ml-4 mt-2 toggle toggle-primary"
								bind:checked={jadwal2Enable}
							/>
						</div>
						<div class="col-span-2">
							<div class="text-center text-xs">Durasi</div>
							<div class="grid grid-cols-2">
								<input
									class="text-center text-2xl font-bold bg-lime-100"
									type="number"
									placeholder={String(durasiSiram2)}
									bind:value={durasiSiram2}
									min=1
									max=60
								/>
								<div class="text-xs">mnt</div>
							</div>
						</div>
					</div>
				</div>

				<div class="col-span-5 text-xs border border-white my-2 px-2">
					<div class="grid grid-cols-2 gap-4 p-2 justify-items-center">
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

				<!-- hari-->
				<div class="col-span-10 text-xs">
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
			</div>
		{:else if showjadwal === 3}
			<!-- jadwal 3-->
			<div
				class="grid grid-cols-10 gap-2 my-2 justify-items-center border rounded-lg border-1 bg-lime-100"
			>
				<!--waktu dan durasi-->
				<div class="col-span-10 text-center my-1">Jadwal 3</div>

				<div class="col-span-5 py-2">
					<div class="grid grid-cols-5 mt-1 justify-items-center">
						<div class="col-span-3 ml-2">
							<div class="text-center text-xs">Waktu</div>
							<SveltyPicker
								bind:value={waktuSiram3}
								inputClasses="w-20 font-bold text-2xl text-center bg-lime-100"
								placeholder={waktuSiram3}
								format="hh:ii"
								displayFormat="hh:ii "
							/>
							<input
								type="checkbox"
								class="ml-4 mt-2 toggle toggle-primary"
								bind:checked={jadwal3Enable}
							/>
						</div>
						<div class="col-span-2">
							<div class="text-center text-xs">Durasi</div>
							<div class="grid grid-cols-2">
								<input
									class="text-center text-2xl font-bold bg-lime-100"
									type="number"
									placeholder={String(durasiSiram3)}
									bind:value={durasiSiram3}
									min=1
									max=60
								/>
								<div class="text-xs">mnt</div>
							</div>
						</div>
					</div>
				</div>

				<div class="col-span-5 text-xs border border-white my-2 px-2">
					<div class="grid grid-cols-2 gap-4 p-2 justify-items-center">
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

				<!-- hari-->
				<div class="col-span-10 text-xs">
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
				max="100"
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
	.bg_siram {
		background-image: url('/bg_siram.png');
		background-position: center;
		background-size: cover;
	}
</style>
