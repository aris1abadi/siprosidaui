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
		volumeAir
	} from '$lib/store/stores';
	import Modal from '$lib/Modal.svelte';
	import SveltyPicker from 'svelty-picker';

	let showjadwal = 0;

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

	let hari = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
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
		if ($firtLoad) {
			goto('/');
		}
	});

	function semprotPestisida(lahan) {
		let msg = '0';
		let readySend = false;
		if (lahan === 0) {
			if ($pestisida_status) {
				if (
					!$lahan1Pestisida_status &&
					!$lahan2Pestisida_status &&
					!$lahan3Pestisida_status &&
					!$lahan4Pestisida_status
				) {
					$pestisida_status = false;
					msg = '0';
					alert('Pilih lahan yang akan disemprot Pestisida');
				} else {
					msg = '1';
					readySend = true;
				}
			} else {
				readySend = true;
				msg = '0';
				$lahan1Pestisida_status = false;
				$lahan2Pestisida_status = false;
				$lahan3Pestisida_status = false;
				$lahan4Pestisida_status = false;
			}
		} else if (lahan == 1) {
			if ($lahan1Pestisida_status) {
				msg = '1';
				$pestisida_status = true;
			} else {
				msg = '0';
				if (!$lahan2Pestisida_status && !$lahan3Pestisida_status && !$lahan4Pestisida_status) {
					$pestisida_status = false;
				}
			}
		} else if (lahan == 2) {
			if ($lahan2Pestisida_status) {
				msg = '1';
				$pestisida_status = true;
			} else {
				msg = '0';
				if (!$lahan1Pestisida_status && !$lahan3Pestisida_status && !$lahan4Pestisida_status) {
					$pestisida_status = false;
				}
			}
		} else if (lahan == 3) {
			if ($lahan3Pestisida_status) {
				msg = '1';
				$pestisida_status = true;
			} else {
				msg = '0';
				if (!$lahan2Pestisida_status && !$lahan1Pestisida_status && !$lahan4Pestisida_status) {
					$pestisida_status = false;
				}
			}
		} else if (lahan == 4) {
			if ($lahan4Pestisida_status) {
				msg = '1';
				$pestisida_status = true;
			} else {
				msg = '0';
				if (!$lahan2Pestisida_status && !$lahan3Pestisida_status && !$lahan1Pestisida_status) {
					$pestisida_status = false;
				}
			}
		}
		if (readySend) {
			kirimMsg('pestisida', lahan, 'cmd', msg);
		}
	}

	function simpanDosisAirPestisida() {
		kirimMsg('pestisida', 0, 'dosisAirPestisida', String($dosisAirPestisida));
	}
	function simpanDosisPestisida() {
		kirimMsg('pestisida', 0, 'dosisPestisida', String($dosisPestisida));
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
		let jwl = packingJadwal();
		kirimMsg('pestisida', 0, 'setJadwal', jwl);
		console.log(jwl);
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
		dosisAirPestisida3 = parseInt(jadwal3[16]);
		dosisPestisida3 = parseInt(jadwal3[17]);
		//durasiSiram3 = jadwal1[18];
	}

	function showJadwalPestisida() {
		showModal = true;
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
</script>

<div class="h-screen w-screen bg-zinc-800">
	<div class="bg_pestisida h-full w-full max-w-md mx-auto flex flex-col">
		<div>
			<img src=" /hd_pestisida1.png" alt="hd_pestisida" />
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
							on:change={() => pilihLahanPestisida(1)}
						/></label
					>

					<label class="text-xs font-bold text-center"
						><small>Lahan2</small>
						<input
							type="checkbox"
							class="toggle toggle-accent"
							bind:checked={$lahan2Pestisida_status}
							on:change={() => pilihLahanPestisida(2)}
						/></label
					>
					<label class="text-xs font-bold text-center"
						><small>Lahan3</small>
						<input
							type="checkbox"
							class="toggle toggle-accent"
							bind:checked={$lahan3Pestisida_status}
							on:change={() => pilihLahanPestisida(3)}
						/></label
					>
					<label class="text-xs font-bold text-center"
						><small>Lahan4</small>
						<input
							type="checkbox"
							class="toggle toggle-accent"
							bind:checked={$lahan4Pestisida_status}
							on:change={() => pilihLahanPestisida(4)}
						/></label
					>
				</div>

				<div class="grid grid-cols-3 px-6 gap-4 my-4 justify-items-center">
					<div class="text-center text-xs">Jadwal</div>
					<div></div>
					<div class="text-center text-xs">Semprot</div>
					<button
						on:click={() => showJadwalPestisida()}
						class="w-3/4 h-16 rounded-xl shadow-lg border"
					>
						<div class="grid grid-cols-2 gap-1">
							<div>
								<div class="text-xs text-black-300">
									
									{#if jadwal1Enable}
									<small>{waktuSemprot1}</small>
										
									{:else}
										--:--
									{/if}
								</div>
								<div class="text-xs text-black-300">
									
									{#if jadwal2Enable}
									<small>{waktuSemprot2}</small>
										
									{:else}
										--:--
									{/if}
								</div>
								<div class="text-xs text-black-300">
									
									{#if jadwal3Enable}
									<small>{waktuSemprot3}</small>
										
									{:else}
										--:--
									{/if}
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

					<label class="swap swap-flip h-12 w-12">
						<!-- this hidden checkbox controls the state -->
						<input
							type="checkbox"
							bind:checked={$pestisida_status}
							on:change={() => semprotPestisida(0)}
						/>

						<div class="swap-on">
							<img class="ml-2" src=" /btnhijau.jpeg" alt="btn_on" />
						</div>
						<div class="swap-off">
							<img class="ml-2" src=" /btnmerah.jpeg" alt="btn_off" />
						</div>
					</label>
				</div>
			</div>
			<div></div>
		</div>
		<div class="grid justify-items-start">
			<button class="h-8 w-8 ml-8 mt-24" on:click={() => goto('/home')}>
				<img src=" /btn_home2.png" alt="btn_home" />
			</button>
		</div>
	</div>
</div>

<!--Jadwal-->
<Modal bind:showModal>
	<h2 slot="header" class="text-xl font-bold text-center">Jadwal Pestisida</h2>

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
								bind:group={cekHari1[idx]}
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
			<input type="checkbox" class="ml-4 mt-1 toggle toggle-primary" bind:checked={jadwal2Enable} />
		</div>
		<!-- hari-->
		<div class="col-span-8 text-xs">
			<div class="grid grid-cols-7 gap-4 mb-2 ml-1 justify-items-center">
				{#each hari as hariNow, idx}
					<label class="text-xs font-bold">
						<div><small>{hariNow}</small></div>
						<input
							type="checkbox"
							bind:group={cekHari2[idx]}
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
			<input type="checkbox" class="ml-4 mt-1 toggle toggle-primary" bind:checked={jadwal3Enable} />
		</div>
		<!-- hari-->
		<div class="col-span-8 text-xs">
			<div class="grid grid-cols-7 gap-4 mb-2 ml-1 justify-items-center">
				{#each hari as hariNow, idx}
					<label class="text-xs font-bold">
						<div><small>{hariNow}</small></div>
						<input
							type="checkbox"
							bind:group={cekHari3[idx]}
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
	<div class="grid justify-items-center">
		<button
			on:click={() => {
				showModal = false;
				simpanJadwalPestisida();
			}}
			class="w-1/2 h-12 border rounded-lg bg-green-900 text-white mt-4 mb-4">Simpan Jadwal</button
		>
	</div>
</Modal>

<style>
	.bg_pestisida {
		background-image: url(' /bg_pestisida.png');
		background-size: cover;
		background-position: center;
	}
</style>
