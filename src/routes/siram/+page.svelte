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
		siram_status
	} from '$lib/store/stores';

	import Modal from '$lib/Modal.svelte';
	import SveltyPicker from 'svelty-picker';

	let valueTimeOnly;
	let waktuSiram1 = 5;
	let waktuSiram2 = 5;
	let waktuSiram3 = 5;
	let hari = ['Senin', 'Selasa', 'Rabo', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
	let lahan = ['Lahan 1', 'Lahan 2', 'Lahan 3', 'Lahan 4'];
	let pilihanHari1 = [];
	let pilihanHari2 = [];
	let pilihanHari3 = [];

	let pilihanLahan1 = [];
	let pilihanLahan2 = [];
	let pilihanLahan3 = [];

	let showModal = false;

	function siramLahan(lahan) {
		let lahanSts = '0';
		if (lahan == 0) {
		} else if (lahan == 1) {
			if ($lahan1_status) {
				lahanSts = '1';
			} else {
				lahanSts = '0';
			}
		} else if (lahan == 2) {
			if ($lahan2_status) {
				lahanSts = '1';
			} else {
				lahanSts = '0';
			}
		} else if (lahan == 3) {
			if ($lahan3_status) {
				lahanSts = '1';
			} else {
				lahanSts = '0';
			}
		} else if (lahan == 4) {
			if ($lahan4_status) {
				lahanSts = '1';
			} else {
				lahanSts = '0';
			}
		}
		console.log('siram lahan ' + lahan + '=> ' + lahanSts + '(1=ON,0=OFF)');
		kirimMsg('siram', lahan, 'cmd', lahanSts);
	}

	function setUseLengas() {
		if ($useLengas) {
			console.log('pake lengas');
			kirimMsg('siram', '0', 'useLengas', '1');
		} else {
			console.log('lengas off');
			kirimMsg('siram', '0', 'useLengas', '0');
		}
	}

	function trigerLengasChange() {
		console.log('triger lengas: ' + $ambangLengas);
		kirimMsg('siram', '0', 'setAmbang', String($ambangLengas));
	}
</script>

<div class="h-screen w-screen bg-zinc-800">
	<div class="bg_siram h-full w-full max-w-md mx-auto flex flex-col">
		<div>
			<img src=" /hd_siram1.png" alt="hd_siram" />
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
				<div class="w-full h-full bg-base-100 rounded-lg shadow-xl">
					<div class="grid grid-cols-4 gap-2 ml-2 mt-2">
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
					<div
						class="grid grid-cols-3 w-full h-24 mt-4 border border-blue-500 rounded-lg rounded-tl-none rounded-tr-none justify-items-center"
					>
						<div class="text-sm font-bold text-center"><small>Jadwal</small></div>
						<div></div>
						<div class="text-sm font-bold mb-0"><small>Siram Sekarang</small></div>
						<button on:click={() => (showModal = true)} class="w-1/2 h-1/2 mt-4">
							<img src=" /jadwal.png" alt="btn" />
						</button>
						<!--volume air-->
						<div class=" w-3/4 h-16 border rounded">
							<div class="mt-1 text-center text-sm">Air</div>
							<div class="text-center font-bold text-lg">{$volumeAir} Ltr</div>
						</div>
						<label class="swap swap-flip h-12 w-12">
							<!-- this hidden checkbox controls the state -->
							<input type="checkbox" bind:checked={$siram_status} on:change={() => siramLahan(0)} />

							<div class="swap-on">
								<img class="ml-2" src=" /btnhijau.jpeg" alt="btn_on" />
							</div>
							<div class="swap-off">
								<img class="ml-2" src=" /btnmerah.jpeg" alt="btn_off" />
							</div>
						</label>
					</div>
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
	<h2 slot="header" class="text-xl font-bold text-center">Jadwal Penyiraman</h2>
	<!-- jadwal 1-->
	<div class="grid grid-cols-10 gap-2 my-2 justify-items-center border rounded-lg border-1">
		<!--waktu dan dosis-->
		<div></div>
		<div class="col-span-2">
			<div class="text-center text-xs">Waktu</div>
			<SveltyPicker
				bind:value={valueTimeOnly}
				inputClasses="w-24 font-bold text-lg text-center"
				placeholder="06:30"
				format="hh:ii"
				displayFormat="hh:ii "
			/>
		</div>
		<div></div>
		<div class="col-span-3">
			<div class="text-center text-xs">Waktu Siram</div>
			<div class="grid grid-cols-2">
				<input
					class="text-center text-lg font-bold"
					type="number"
					placeholder="2"
					bind:value={waktuSiram1}
					min="1"
					max="20"
				/>
				<div>menit</div>
			</div>
		</div>
		<div class="col-span-3"></div>

		<!-- hari-->
		<div class="col-span-10 text-xs">
			<div class="grid grid-cols-7 gap-2 justify-items-center">
				{#each hari as hariNow}
					<div>
						<div>{hariNow}</div>
						<input type="checkbox" bind:group={pilihanHari1} value={hariNow} />
					</div>
				{/each}
			</div>
		</div>
		<div class="col-span-10 text-xs border my-4 px-2">
			<div class="grid grid-cols-4 gap-4 justify-items-center">
				{#each lahan as lahanNow}
					<div>
						<div>{lahanNow}</div>
						<input type="checkbox" bind:group={pilihanLahan1} value={lahanNow} />
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- jadwal 2-->
	<div class="grid grid-cols-10 gap-2 mt-4 justify-items-center border rounded-lg border-1">
		<!--waktu dan dosis-->
		<div></div>
		<div class="col-span-2">
			<div class="text-center text-xs">Waktu</div>
			<SveltyPicker
				bind:value={valueTimeOnly}
				inputClasses="w-24 font-bold text-lg text-center"
				placeholder="06:30"
				format="hh:ii"
				displayFormat="hh:ii "
			/>
		</div>
		<div></div>
		<div class="col-span-3">
			<div class="text-center text-xs">Waktu siram</div>
			<div class="grid grid-cols-2">
				<input
					class="text-center text-lg font-bold"
					type="number"
					placeholder="2"
					bind:value={waktuSiram2}
					min="1"
					max="20"
				/>
				<div>menit</div>
			</div>
		</div>
		<div class="col-span-3"></div>

		<!-- hari-->
		<div class="col-span-10 text-xs">
			<div class="grid grid-cols-7 justify-items-center">
				{#each hari as hariNow}
					<div>
						<div>{hariNow}</div>
						<input type="checkbox" bind:group={pilihanHari2} value={hariNow} />
					</div>
				{/each}
			</div>

			<div class="col-span-10 text-xs border mt-4 px-2">
				<div class="grid grid-cols-4 gap-4 justify-items-center">
					{#each lahan as lahanNow}
						<div>
							<div>{lahanNow}</div>
							<input type="checkbox" bind:group={pilihanLahan2} value={lahanNow} />
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- jadwal 1-->
	<div class="grid grid-cols-10 gap-2 mt-4 justify-items-center border rounded-lg border-1">
		<!--waktu dan dosis-->
		<div></div>
		<div class="col-span-2">
			<div class="text-center text-xs">Waktu</div>
			<SveltyPicker
				bind:value={valueTimeOnly}
				inputClasses="w-24 font-bold text-lg text-center"
				placeholder="06:30"
				format="hh:ii"
				displayFormat="hh:ii "
			/>
		</div>
		<div></div>
		<div class="col-span-3">
			<div class="text-center text-xs">Waktu Siram</div>
			<div class="grid grid-cols-2">
				<input
					class="text-center text-lg font-bold"
					type="number"
					placeholder="2"
					bind:value={waktuSiram3}
					min="1"
					max="20"
				/>
				<div>menit</div>
			</div>
		</div>
		<div class="col-span-3"></div>

		<!-- hari-->
		<div class="col-span-10 text-xs">
			<div class="grid grid-cols-7 justify-items-center">
				{#each hari as hariNow}
					<div>
						<div>{hariNow}</div>
						<input type="checkbox" bind:group={pilihanHari3} value={hariNow} />
					</div>
				{/each}
			</div>

			<div class="col-span-10 text-xs border mt-4 px-2">
				<div class="grid grid-cols-4 gap-4 justify-items-center">
					{#each lahan as lahanNow}
						<div>
							<div>{lahanNow}</div>
							<input type="checkbox" bind:group={pilihanLahan3} value={lahanNow} />
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
	<div class="grid justify-items-center">
		<button
			on:click={() => simpanJadwalSiram()}
			class="w-1/2 h-12 border rounded-lg bg-green-900 text-white mt-4 mb-4">Simpan Jadwal</button
		>
	</div>
</Modal>

<style>
	.bg_siram {
		background-image: url(' /bg_siram.png');
		background-position: center;
		background-size: cover;
	}
</style>
