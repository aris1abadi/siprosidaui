<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { kirimMsg } from '$lib/mqttHandle';

	onMount(() => {});

	let dosisAir = 1;
	let dosisBiopest = 1;

	let lahan1Biopest_status = false;
	let lahan2Biopest_status = false;
	let lahan3Biopest_status = false;
	let lahan4Biopest_status = false;

	function semprotBiopest(lahan) {
		
	}
</script>

<div class="h-screen w-screen bg-zinc-800">
	<div class="bg_biopest h-full w-full max-w-md mx-auto flex flex-col">
		<div>
			<img src=" /hd_biopest1.png" alt="hd_biopest" />
		</div>
		<div class="grid grid-cols-12 w-full h-1/2">
			<div></div>
			<div class="col-span-10 bg-white rounded-lg shadow-xl">
				<div class="text-sm font-bold text-center mt-2">DOSIS BIOPESTISIDA</div>
				<div class="grid grid-cols-2 gap-4 h-20 px-6 mt-4">
					<label class=" border rounded border-emerald-950">
						<div class="text-center bg-red-100 rounded rounded-bl-none rounded-br-none ">
							Air
						</div>
						<div class="grid justify-items-center">
							<div>
								<input
									class="text-center text-xl w-1/2 font-bold"
									type="number"
									bind:value={dosisAir}
									min="1"
									max="20"
								/>
								<span class="text-xs">Liter</span>
							</div>
							<input class="w-3/4 h-2 mt-2" type="range" bind:value={dosisAir} min="1" max="20" />
						</div>
					</label>

					<label class=" border rounded border-emerald-950">
						<div class="text-center bg-red-100 rounded rounded-bl-none rounded-br-none ">
							Biopestisida
						</div>
						<div class="grid justify-items-center">
							<div>
								<input
									class="text-center text-xl w-1/2 font-bold"
									type="number"
									bind:value={dosisBiopest}
									min="1"
									max="100"
								/>
								<span class="text-xs">mL</span>
							</div>
							<input class="w-3/4 h-2 mt-2" type="range" bind:value={dosisBiopest} min="1" max="100" />
						</div>
					</label>
				</div>

				<div class="grid grid-cols-4 gap-2 mt-4 px-4">
					<label class="text-xs font-bold text-center"
						><small>Lahan1</small>
						<input
							type="checkbox"
							class="toggle toggle-accent"
							bind:checked={lahan1Biopest_status}
							on:change={() => semprotBiopest(1)}
						/></label
					>

					<label class="text-xs font-bold text-center"
						><small>Lahan2</small>
						<input
							type="checkbox"
							class="toggle toggle-accent"
							bind:checked={lahan2Biopest_status}
							on:change={() => semprotBiopest(2)}
						/></label
					>
					<label class="text-xs font-bold text-center"
						><small>Lahan3</small>
						<input
							type="checkbox"
							class="toggle toggle-accent"
							bind:checked={lahan3Biopest_status}
							on:change={() => semprotBiopest(3)}
						/></label
					>
					<label class="text-xs font-bold text-center"
						><small>Lahan4</small>
						<input
							type="checkbox"
							class="toggle toggle-accent"
							bind:checked={lahan4Biopest_status}
							on:change={() => semprotBiopest(4)}
						/></label
					>
				</div>

				<div class="grid grid-cols-2 px-6 gap-4 mt-8 justify-items-center">
					<div class="text-center text-xs">Jadwal</div>
					<div class="text-center text-xs">Semprot Sekarang</div>
					<button class="h-12 w-12">
						<img src=" /jadwal.png" alt="btn_jadwal" />
					</button>

					<label class="swap swap-flip h-12 w-12">
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
			<div></div>
		</div>

		<div class="grid justify-items-start ">
			<button class="h-8 w-8 ml-8 mt-24" on:click={() =>goto('/home')}> <img src=" /btn_home2.png" alt="btn_home"> </button>
		</div>
	</div>
</div>

<style>
	.bg_biopest {
		background-image: url('/bg_biopest.png');
		background-size: cover;
		background-position: center;
	}
</style>
