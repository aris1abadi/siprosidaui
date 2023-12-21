<script>
	import { goto } from '$app/navigation';
	import { kirimMsg } from '$lib/mqttHandle';
	import {
		suhuUdara,
		kelembabanUdara,
		lengas1,
		resetAllValue,
		demoMode,
		conect_status
	} from '$lib/store/stores';
	import { onMount } from 'svelte';

	let sts_count = 0;

	onMount(() => {
		resetAllValue();
		getAllStatus();
	});

	function openPage(page) {
		if (page === 1) {
			kirimMsg('siram', 0, 'getJadwal', '1');
			goto('/siram');
		} else if (page === 2) {
			kirimMsg('pestisida', 0, 'getJadwal', '1');
			goto('/pestisida');
		} else if (page === 3) {
			kirimMsg('biopest', 0, 'getJadwal', '1');
			goto('/biopest');
		}
	}

	function getAllStatus() {
		kirimMsg('kontrol', 0, 'getAllStatus', '0');
	}

	let suhuTanah = '-';
</script>

<div class="h-screen w-screen bg-zinc-800">
	<div class="mainbg h-full w-full max-w-md mx-auto flex flex-col">
		<div>
			<img src="/hd_home.png" alt="hd_home" />
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

		<div class="grid grid-cols-12 h-16 w-full">
			<div class="col-span-2"></div>
			<div class="col-span-8 h-full bg-white rounded-lg mt-0 shadow-xl">
				<div class="grid grid-cols-3">
					<div>
						<div class="text-xs text-center mt-4"><small>Suhu</small></div>
						<div class="text-center font-bold">{$suhuUdara}°C</div>
					</div>
					<div class="text-center">Udara</div>
					<div>
						<div class="text-xs text-center mt-4"><small>Kelembaban</small></div>
						<div class="text-center font-bold">{$kelembabanUdara}%</div>
					</div>
				</div>
			</div>
			<div class="col-span-2"></div>
		</div>
		<div class="grid grid-cols-12 gap-4 h-16 w-full mt-4">
			<div class="col-span-2"></div>
			<div class="col-span-4 h-full bg-white rounded-lg shadow-xl">
				<div class="text-center text-xs mt-1">Tanah</div>
				<div class="grid grid-cols-2">
					<div>
						<div class="text-center text-xs"><small>Lengas</small></div>
						<div class="text-center text-xs font-bold">{$lengas1}%</div>
					</div>
					<div>
						<div class="text-center text-xs"><small>Suhu</small></div>
						<div class="text-center text-xs font-bold">{suhuTanah}°C</div>
					</div>
				</div>
			</div>
			<div class="col-span-4 h-full bg-white rounded-lg shadow-xl">
				<div class="text-center text-xs mt-1">Penyiraman</div>
				<div class="grid grid-cols-2">
					<label class="swap swap-flip h-3/4 w-3/4 ml-2">
						<!-- this hidden checkbox controls the state -->
						<input type="checkbox" />

						<div class="swap-on">
							<img src="/btn_air1.png" alt="srm_on" />
						</div>
						<div class="swap-off">
							<img src="/btn_air2.png" alt="srm_off" />
						</div>
					</label>

					<div class="h-1/2 w-1/2 mt-1 ml-1">
						<label class="swap swap-flip">
							<!-- this hidden checkbox controls the state -->
							<input type="checkbox" />

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
			<div class="col-span-2"></div>
		</div>

		<div class="grid grid-cols-11 gap-8 h-24 w-full mt-6">
			<div class="col-span-1"></div>
			<button on:click={() => openPage(1)} class="col-span-3 h-full bg-white rounded-lg shadow-xl">
				<div class="text-xs font-bold text-center mt-1">
					<small>Penyiramam</small>
				</div>
				<div>
					<img src=" /penyiraman.png" alt="siram" />
				</div>
			</button>
			<button on:click={() => openPage(2)} class="col-span-3 h-full bg-white rounded-lg shadow-xl">
				<div class="text-xs font-bold text-center mt-1">
					<small>Pestisida</small>
				</div>
				<div>
					<img src=" /pestisida.png" alt="pestisida" />
				</div>
			</button>
			<button on:click={() => openPage(3)} class="col-span-3 h-full bg-white rounded-lg shadow-xl">
				<div class="text-xs font-bold text-center mt-1">
					<small>Biopestisida</small>
				</div>
				<div>
					<img src=" /biopestisida.png" alt="biopest" />
				</div>
			</button>
			<div class="col-span-1"></div>
		</div>

		<div class="grid grid-cols-5 w-full h-12 justify-items-center mt-16">
			<button on:click={() => goto('/')}>
				<img class="h-8 w-8" src="/logout.png" alt="btn_out" />
			</button>
			<div class="col-span-4"></div>
		</div>
	</div>
</div>

<style>
	.mainbg {
		background-image: url('/bg_home.png');
		background-position: center;
		background-size: cover;
	}
</style>
