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
		pestisida_status
	} from '$lib/store/stores';
	import Modal from '$lib/Modal.svelte';
	import SveltyPicker from 'svelty-picker';

	let valueTimeOnly;
	let jadwal1_dosisAirPestisida;
	let jadwal1_dosisPestisida;
	let jadwal2_dosisAirPestisida;
	let jadwal2_dosisPestisida;
	let jadwal3_dosisAirPestisida;
	let jadwal3_dosisPestisida;
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
			if($lahan1Pestisida_status)msg = '1'
		}else if(lahan == 2){
			if($lahan2Pestisida_status)msg = '1'
		}else if(lahan == 3){
			if($lahan3Pestisida_status)msg = '1'
		}else if(lahan == 4){
			if($lahan4Pestisida_status)msg = '1'
		}
		kirimMsg("pestisida",lahan,"lahan",msg)
	}
	function semprotPestisida(){
		if($pestisida_status){
			kirimMsg("pestisida",0,"cmd",'1')
		}else{
			kirimMsg("pestisida",0,"stop",'1')
		}
	}

	function simpanDosisAirPestisida(){
		kirimMsg("pestisida",0,"dosisAirPestisida",String($dosisAirPestisida))
	}
	function simpanDosisPestisida(){
		kirimMsg("pestisida",0,"dosisPestisida",String($dosisPestisida))
	}

	function simpanJadwalPestisida() {
		console.log('Simpan jadwal');
		showModal = false;
		alert("Jadwal pestisida disimpan")
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
					<!--
					<button class="border rounded border-emerald-950" on:click={() =>my_modal_1.showModal()}>
						<div class="text-center bg-red-100 rounded rounded-bl-none rounded-br-none">Air</div>
						<div class="text-center text-xl font-bold mt-1">{dosisAir} Liter</div>
					</button>
				-->
					<label class=" border rounded border-emerald-950">
						<div class="text-center bg-red-100 rounded rounded-bl-none rounded-br-none">Air</div>
						<div class="grid justify-items-center">
							<div>
								<input
									class="text-center text-xl w-1/2 font-bold"
									type="number"
									bind:value={$dosisAirPestisida}
									on:change={()=>simpanDosisAirPestisida()}
									min="1"
									max="20"
								/>
								<span class="text-xs">Liter</span>
							</div>
							<input
								class="w-3/4 h-2 mt-2"
								type="range"
								bind:value={$dosisAirPestisida}
								on:change={()=>simpanDosisAirPestisida()}
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
							on:change={() => pilihLahan(1)}
						/></label
					>

					<label class="text-xs font-bold text-center"
						><small>Lahan2</small>
						<input
							type="checkbox"
							class="toggle toggle-accent"
							bind:checked={$lahan2Pestisida_status}
							on:change={() => pilihLahan(2)}
						/></label
					>
					<label class="text-xs font-bold text-center"
						><small>Lahan3</small>
						<input
							type="checkbox"
							class="toggle toggle-accent"
							bind:checked={$lahan3Pestisida_status}
							on:change={() => pilihLahan(3)}
						/></label
					>
					<label class="text-xs font-bold text-center"
						><small>Lahan4</small>
						<input
							type="checkbox"
							class="toggle toggle-accent"
							bind:checked={$lahan4Pestisida_status}
							on:change={() => pilihLahan(4)}
						/></label
					>
				</div>

				<div class="grid grid-cols-2 px-6 gap-4 mt-4 justify-items-center">
					<div class="text-center text-xs">Jadwal</div>
					<div class="text-center text-xs">Semprot Sekarang</div>
					<button on:click={() => (showModal = true)}>
						<img class="h-12 w-12" src=" /jadwal.png" alt="btn_jadwal" />
					</button>

					<label class="swap swap-flip h-12 w-12">
						<!-- this hidden checkbox controls the state -->
						<input type="checkbox" bind:checked={$pestisida_status}
						on:change={() => semprotPestisida()}/>

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
				bind:value={jadwal1_dosisAirPestisida}
				min="1"
				max="20"
			/>
		</div>
		<div class="col-span-3">
			<div class="text-center text-xs">Dosis Pestisida</div>
			<input
				class="text-center font-bold"
				type="number"
				placeholder="2"
				bind:value={jadwal1_dosisPestisida}
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
		<div class="col-span-10 text-xs border mt-4 px-2 ">
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
				bind:value={jadwal2_dosisAirPestisida}
				min="1"
				max="20"
			/>
		</div>
		<div class="col-span-3">
			<div class="text-center text-xs">Dosis Pestisida</div>
			<input
				class="text-center font-bold"
				type="number"
				placeholder="2"
				bind:value={jadwal2_dosisPestisida}
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

			<div class="col-span-10 text-xs border mt-4 px-2 ">
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
				bind:value={jadwal3_dosisAirPestisida}
				min="1"
				max="20"
			/>
		</div>
		<div class="col-span-3">
			<div class="text-center text-xs">Dosis Pestisida</div>
			<input
				class="text-center font-bold"
				type="number"
				placeholder="2"
				bind:value={jadwal3_dosisPestisida}
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

			<div class="col-span-10 text-xs border mt-4 px-2 ">
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
			on:click={() => simpanJadwalPestisida()}
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
