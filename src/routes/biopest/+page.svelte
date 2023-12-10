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
		biopest_status
	} from "$lib/store/stores"
	import Modal from '$lib/Modal.svelte';
	import SveltyPicker from 'svelty-picker';

	let valueTimeOnly;
	let jadwal1_dosisAirBiopest;
	let jadwal1_dosisBiopest;
	let jadwal2_dosisAirBiopest;
	let jadwal2_dosisBiopest;
	let jadwal3_dosisAirBiopest;
	let jadwal3_dosisBiopest;
	let hari = ['Senin', 'Selasa', 'Rabo', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
	let lahan = ['Lahan 1','Lahan 2','Lahan 3','Lahan 4',]
	let pilihanHari1 = [];
	let pilihanHari2 = [];
	let pilihanHari3 = [];

	let pilihanLahan1 =[]
	let pilihanLahan2 =[]
	let pilihanLahan3 =[]

	let showModal = false;

	function pilihLahan(lahan) {
		let msg = '0'
		if(lahan == 1){
			if($lahan1Biopest_status)msg = '1'
		}else if(lahan == 2){
			if($lahan2Biopest_status)msg = '1'
		}else if(lahan == 3){
			if($lahan3Biopest_status)msg = '1'
		}else if(lahan == 4){
			if($lahan4Biopest_status)msg = '1'
		}
		kirimMsg("biopest",lahan,"lahan",msg)
	}
	function semprotBiopest(){
		if($biopest_status){
			kirimMsg("biopest",0,"cmd",'1')
		}else{
			kirimMsg("biopest",0,"stop",'1')
		}
	}

	function simpanDosisAirBiopest(){
		kirimMsg("biopest",0,"dosisAirBiopest",String($dosisAirBiopest))
	}
	function simpanDosisiopest(){
		kirimMsg("biopest",0,"dosisBiopest",String($dosisBiopest))
	}

	function simpanJadwalBiopest() {
		console.log('Simpan jadwal');
		showModal = false;
		alert("Jadwal Biopest disimpan")
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
						<div class="text-center bg-red-100 rounded rounded-bl-none rounded-br-none">Air</div>
						<div class="grid justify-items-center">
							<div>
								<input
									class="text-center text-xl w-1/2 font-bold"
									type="number"
									bind:value={$dosisAirBiopest}
									min="1"
									max="20"
								/>
								<span class="text-xs">Liter</span>
							</div>
							<input class="w-3/4 h-2 mt-2" type="range" bind:value={$dosisAirBiopest} min="1" max="20" />
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
									min="1"
									max="100"
								/>
								<span class="text-xs">mL</span>
							</div>
							<input
								class="w-3/4 h-2 mt-2"
								type="range"
								bind:value={$dosisBiopest}
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

				<div class="grid grid-cols-2 px-6 gap-4 mt-8 justify-items-center">
					<div class="text-center text-xs">Jadwal</div>
					<div class="text-center text-xs">Semprot Sekarang</div>
					<button on:click={() =>(showModal = true)} class="h-12 w-12">
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

		<div class="grid justify-items-start">
			<button class="h-8 w-8 ml-8 mt-24" on:click={() => goto('/home')}>
				<img src=" /btn_home2.png" alt="btn_home" />
			</button>
		</div>
	</div>
</div>

<!--Jadwal-->
<Modal bind:showModal>
	<h2 slot="header" class="text-xl font-bold text-center">Jadwal Biopestisida</h2>
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
			<div class="text-center text-xs">dosis Air</div>
			<input
				class="text-center font-bold"
				type="number"
				placeholder="2"
				bind:value={jadwal1_dosisAirBiopest}
				min="1"
				max="20"
			/>
		</div>
		<div class="col-span-3">
			<div class="text-center text-xs">Dosis Biopestisida</div>
			<input
				class="text-center font-bold"
				type="number"
				placeholder="2"
				bind:value={jadwal1_dosisBiopest}
				min="1"
				max="50"
			/>
		</div>

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
		<div class="col-span-10 text-xs border mt-4 px-2">
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
			<div class="text-center text-xs">dosis Air</div>
			<input
				class="text-center font-bold"
				type="number"
				placeholder="2"
				bind:value={jadwal2_dosisAirBiopest}
				min="1"
				max="20"
			/>
		</div>
		<div class="col-span-3">
			<div class="text-center text-xs">Dosis Biopestisida</div>
			<input
				class="text-center font-bold"
				type="number"
				placeholder="2"
				bind:value={jadwal2_dosisBiopest}
				min="1"
				max="50"
			/>
		</div>

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
			<div class="text-center text-xs">dosis Air</div>
			<input
				class="text-center font-bold"
				type="number"
				placeholder="2"
				bind:value={jadwal3_dosisAirBiopest}
				min="1"
				max="20"
			/>
		</div>
		<div class="col-span-3">
			<div class="text-center text-xs">Dosis Biopestisida</div>
			<input
				class="text-center font-bold"
				type="number"
				placeholder="2"
				bind:value={jadwal3_dosisBiopest}
				min="1"
				max="50"
			/>
		</div>

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
			on:click={() => simpanJadwalBiopest()}
			class="w-1/2 h-12 border rounded-lg bg-green-900 text-white mt-4 mb-4">Simpan Jadwal</button
		>
	</div>
</Modal>

<style>
	.bg_biopest {
		background-image: url('/bg_biopest.png');
		background-size: cover;
		background-position: center;
	}
</style>
