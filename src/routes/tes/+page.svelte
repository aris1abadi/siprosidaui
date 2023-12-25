<script>
	import { goto } from '$app/navigation';
	import { kirimMsg } from '$lib/mqttHandle';
	import {
		resetAllValue,
		demoMode,
		conect_status,
		lahan1_status,
		lahan2_status,
		lahan3_status,
		lahan4_status
	} from '$lib/store/stores';
	import { onMount } from 'svelte';

	let sts_count = 0;
	let pompaUtama_sts = false;
	let pompaSemprot_sts = false;
	let pompaPestisida_sts = false;
	let pompaAdukPestisida_sts = false;
	let pompaBiopest_sts = false;
	let pompaAdukBiopest_sts = false;
	let selenoidInletPestisida_sts = false;
	let selenoidOutletPestisida_sts = false;
	let selenoidInletBiopest_sts = false;
	let selenoidOutletBiopest_sts = false;

	onMount(() => {
		resetAllValue();
		getAllStatus();
	});

	function selenoidLahan(lahan, val) {
		if (val) {
			kirimMsg('selenoid', lahan, 'lahan', '1');
		} else {
			kirimMsg('selenoid', lahan, 'lahan', '0');
		}
	}

	function pompaTes(val) {
		if (val === 1) {
			if (pompaUtama_sts) {
				//pompa utama
				kirimMsg('pompa', val, 'utama', '1');
			} else {
				kirimMsg('pompa', val, 'utama', '0');
			}
		} else if (val === 2) {
			//pompa semprot
			if (pompaSemprot_sts) {
				kirimMsg('pompa', val, 'semprot', '1');
			} else {
				kirimMsg('pompa', val, 'semprot', '0');
			}
		} else if (val === 3) {
			//pompa pestisida
			if (pompaPestisida_sts) {
				kirimMsg('pompa', val, 'pestisida', '1');
			} else {
				kirimMsg('pompa', val, 'pestisida', '0');
			}
		} else if (val === 4) {
			if (pompaAdukPestisida_sts) {
				kirimMsg('pompa', val, 'adukPestisida', '1');
			} else {
				kirimMsg('pompa', val, 'adukPestisida', '0');
			}
		} else if (val === 5) {
			if (pompaBiopest_sts) {
				kirimMsg('pompa', val, 'biopest', '1');
			} else {
				kirimMsg('pompa', val, 'biopest', '0');
			}
		} else if (val === 6) {
			if (pompaAdukBiopest_sts) {
				kirimMsg('pompa', val, 'adukBiopest', '1');
			} else {
				kirimMsg('pompa', val, 'adukBiopest', '0');
			}
		}
	}

	function selenoidTes(val) {
		switch (val) {
			case 1:
				if (selenoidInletPestisida_sts) {
					kirimMsg('selenoid', 0, 'inletPestisida', '1');
				} else {
					kirimMsg('selenoid', 0, 'inletPestisida', '0');
				}
				break;

				case 2:
				if (selenoidOutletPestisida_sts) {
					kirimMsg('selenoid', 0, 'outletPestisida', '1');
				} else {
					kirimMsg('selenoid', 0, 'outletPestisida', '0');
				}
				break;

				case 3:
				if (selenoidInletBiopest_sts) {
					kirimMsg('selenoid', 0, 'inletBiopest', '1');
				} else {
					kirimMsg('selenoid', 0, 'inletBiopest', '0');
				}
				break;

				case 4:
				if (selenoidOutletBiopest_sts) {
					kirimMsg('selenoid', 0, 'outletBiopest', '1');
				} else {
					kirimMsg('selenoid', 0, 'outletBiopest', '0');
				}
				break;
		}
	}

	function getAllStatus() {
		kirimMsg('kontrol', 0, 'getAllStatus', '0');
	}

	let suhuTanah = '-';
</script>

<link
	rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
/>

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

		<div class="w-full grid justify-items-center bg-base-100 rounded-lg shadow-xl pt-1">
			<div class="grid grid-cols-4 w-11/12 gap-2 border border-red-900 mx-2 my-2">
				<div class="col-span-4 text-center">Selenoid Lahan</div>
				<label class="text-xs font-bold text-center"
					><small>Lahan1</small>
					<input
						type="checkbox"
						class="toggle toggle-accent"
						bind:checked={$lahan1_status}
						on:change={() => selenoidLahan(1, $lahan1_status)}
					/>
				</label>
				<label class="text-xs font-bold text-center"
					><small>Lahan2</small>
					<input
						type="checkbox"
						class="toggle toggle-accent"
						bind:checked={$lahan2_status}
						on:change={() => selenoidLahan(2, $lahan2_status)}
					/></label
				>
				<label class="text-xs font-bold text-center"
					><small>Lahan3</small>
					<input
						type="checkbox"
						class="toggle toggle-accent"
						bind:checked={$lahan3_status}
						on:change={() => selenoidLahan(3, $lahan3_status)}
					/></label
				>
				<label class="text-xs font-bold text-center"
					><small>Lahan4</small>
					<input
						type="checkbox"
						class="toggle toggle-accent"
						bind:checked={$lahan4_status}
						on:change={() => selenoidLahan(4, $lahan4_status)}
					/></label
				>
				<hr class="col-span-4" />
				<!--Pompa-->
				<label class="text-xs font-bold text-center col-span-2">
					<div><small>Pompa Utama</small></div>
					<input
						type="checkbox"
						class="toggle toggle-accent"
						bind:checked={pompaUtama_sts}
						on:change={() => pompaTes(1)}
					/>
				</label>
				<label class="text-xs font-bold text-center col-span-2"
					><div><small>Pompa Semprot</small></div>
					<input
						type="checkbox"
						class="toggle toggle-accent"
						bind:checked={pompaSemprot_sts}
						on:change={() => pompaTes(2)}
					/></label
				>
				<hr class="col-span-4" />

				<!--selenoid inlet/outled-->
				<label class="text-xs font-bold text-center"
					><small>Inlet pestisida</small>
					<input
						type="checkbox"
						class="toggle toggle-accent"
						bind:checked={selenoidInletPestisida_sts}
						on:change={() => selenoidTes(1)}
					/>
				</label>
				<label class="text-xs font-bold text-center"
					><small>Outletpestisida</small>
					<input
						type="checkbox"
						class="toggle toggle-accent"
						bind:checked={selenoidOutletPestisida_sts}
						on:change={() => selenoidTes(2)}
					/></label
				>
				<label class="text-xs font-bold text-center"
					><small>InletBiopest</small>
					<input
						type="checkbox"
						class="toggle toggle-accent"
						bind:checked={selenoidInletBiopest_sts}
						on:change={() => selenoidTes(3)}
					/></label
				>
				<label class="text-xs font-bold text-center"
					><small>OutletBiopest</small>
					<input
						type="checkbox"
						class="toggle toggle-accent"
						bind:checked={selenoidOutletBiopest_sts}
						on:change={() => selenoidTes(4)}
					/></label
				>
				<hr class="col-span-4" style="color:black;" />

				<!--pompa pestisida/biopest-->
				<label class="text-xs font-bold text-center"
					><small>Pompa pestisida</small>
					<input
						type="checkbox"
						class="toggle toggle-accent"
						bind:checked={pompaPestisida_sts}
						on:change={() => pompaTes(3)}
					/>
				</label>
				<label class="text-xs font-bold text-center"
					><small>Aduk pestisida</small>
					<input
						type="checkbox"
						class="toggle toggle-accent"
						bind:checked={pompaAdukPestisida_sts}
						on:change={() => pompaTes(4)}
					/></label
				>
				<label class="text-xs font-bold text-center"
					><small>Pompa Biopest</small>
					<input
						type="checkbox"
						class="toggle toggle-accent"
						bind:checked={pompaBiopest_sts}
						on:change={() => pompaTes(5)}
					/></label
				>
				<label class="text-xs font-bold text-center"
					><small>Aduk Biopest</small>
					<input
						type="checkbox"
						class="toggle toggle-accent"
						bind:checked={pompaAdukBiopest_sts}
						on:change={() => pompaTes(6)}
					/></label
				>
			</div>
		</div>

		<div class="grid grid-cols-5 w-full h-12 justify-items-center mt-16">
			<button on:click={() => goto('/')}>
				<img class="h-8 w-8" src="/logout.png" alt="log out" />
				
			</button>
			<div class="col-span-3"></div>
			<button on:click={() => goto('/home')}>
				<img class="h-8 w-8" src="/btn_home2.png" alt="go home" />
			
			</button>
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
