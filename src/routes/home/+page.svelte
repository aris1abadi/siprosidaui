<script>
	import { goto } from '$app/navigation';
	import { kirimMsg } from '$lib/mqttHandle';
	
	import {
		suhuUdara,
		kelembabanUdara,
		lengas1,
		resetAllValue,
		demoMode,
		conect_status,
		kontrolIDStore,
		ble_connected
	} from '$lib/store/stores';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

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
		<div class="w-full h-16">
			<img src="/hd_home.png" alt="hd_home" />
		</div>
		<div class="text-xs w-full text-center mt-4">{get(kontrolIDStore)}</div>
		<div class="w-full h-4 grid justify-items-center my-2">
			{#if $demoMode}
				<div class="text-center text-xs bg-red-500 text-white w-12 h-4"><small>Demo</small></div>
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

		<!--menu-->
		<details class="dropdown w-full pr-4 mt-36 dropdown-top dropdown-end">
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

			<ul class="w-1/2 mr-8 dropdown-content z-[1] rounded shadow-lg border">
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

<style>
	.mainbg {
		background-image: url('/bg_home.png');
		background-position: center;
		background-size: cover;
	}
</style>
