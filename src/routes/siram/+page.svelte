<script>
	import { goto } from '$app/navigation';
	import {onMount} from 'svelte';
	import {kirimMsg} from '$lib/mqttHandle'
	import {lengas1,lengas2,lengas3,lengas4} from "$lib/store/stores"
	import {lengas1Val,lengas2Val,lengas3Val,lengas4Val} from "$lib/mqttHandle"

	onMount(() => {
		
	});
	
	

	let useLengas = false
	let lahan1_status = false
	let lahan2_status = false
	let lahan3_status = false
	let lahan4_status = false
	let trigerLengasVal = "20"

	function siramLahan(lahan){
		let lahanSts = '0';
		if(lahan == 0){

		}else if(lahan == 1){
			if(lahan1_status){
				lahanSts = '1'
			}else {
				lahanSts = '0';
			}
			
		}else if(lahan == 2){
			if(lahan2_status){
				lahanSts = '1'
			}else {
				lahanSts = '0';
			}
		}else if(lahan == 3){
			if(lahan3_status){
				lahanSts = '1'
			}else {
				lahanSts = '0';
			}
		}else if(lahan == 4){
			if(lahan4_status){
				lahanSts = '1'
			}else {
				lahanSts = '0';
			}
		}
		kirimMsg("siram",lahan,'cmd',lahanSts)
	}

	function siramClick() {
		console.log("start siram");
		kirimMsg("siram",'0','cmd','1')
	}
	function setUseLengas(){
		if(useLengas){
			console.log("pake lengas")
			kirimMsg("siram","0","useLengas",'1')
		}else{
			console.log("lengas off")
			kirimMsg("siram","0","useLengas",'0')
		}
	}

	function trigerLengasChange(){
		console.log("triger lengas: " + trigerLengasVal)
		kirimMsg("siram","0","trigerLengas",String(trigerLengasVal))
	}
	
		
</script>

<div class="h-screen w-screen bg-zinc-800">
	<div class="bg_siram h-full w-full max-w-md mx-auto flex flex-col">
		<div>
			<img src="http://abadinet.my.id:1880/hd_siram1.png" alt="hd_siram" />
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
				
					<h2 class="w-full text-center text-xl mb-4">Set Lengas</h2>
					<div class="grid grid-cols-8">
						<div></div>
						<input type="checkbox" class="toggle toggle-accent" bind:checked={useLengas} on:change={setUseLengas}/>
						<div></div>
						<input
							type="range"
							min="0"
							max="100"
							bind:value={trigerLengasVal}
							on:change={()=>trigerLengasChange()}
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
							<input type="checkbox" class="toggle toggle-accent" bind:checked={lahan1_status} on:change={() => siramLahan(1)}/>
						</label>
						<label class="text-xs font-bold text-center"
							><small>Lahan2</small>
							<input type="checkbox" class="toggle toggle-accent" bind:checked={lahan2_status} on:change={() => siramLahan(2)}/></label
						>
						<label class="text-xs font-bold text-center"
							><small>Lahan3</small>
							<input type="checkbox" class="toggle toggle-accent" bind:checked={lahan3_status} on:change={() => siramLahan(3)} /></label
						>
						<label class="text-xs font-bold text-center"
							><small>Lahan4</small>
							<input type="checkbox" class="toggle toggle-accent" bind:checked={lahan4_status} on:change={() => siramLahan(4)} /></label
						>
					</div>
					<!-- kontrol siram-->
					<div class="grid grid-cols-3 w-full h-24 mt-4 border border-blue-500 rounded-lg rounded-tl-none rounded-tr-none justify-items-center">
						<div class="text-sm font-bold text-center"><small>Jadwal</small></div>
						<div></div>
						<div class="text-sm font-bold mb-0"><small>Siram Sekarang</small></div>
						<button class="w-1/2 h-1/2 mt-4 ">
							<img src="http://abadinet.my.id:1880/jadwal.png" alt="btn" />
						</button>
						<button class="w-1/4 h-1/4 ">
							<img src="http://abadinet.my.id:1880/logo_agrostandar.png" alt="btn" />
						</button>
						<label class="swap swap-flip h-12 w-12">
							<!-- this hidden checkbox controls the state -->
							<input type="checkbox" />
	
							<div class="swap-on">
								<img class="ml-2" src="http://abadinet.my.id:1880/btnhijau.jpeg" alt="btn_on" />
							</div>
							<div class="swap-off">
								<img class="ml-2" src="http://abadinet.my.id:1880/btnmerah.jpeg" alt="btn_off" />
							</div>
						</label>
					</div>
				</div>
			</div>
			<div></div>
		</div>

		<div class="grid justify-items-start ">
			<button class="h-8 w-8 ml-8 mt-24" on:click={() =>goto('/home')}> <img src="http://abadinet.my.id:1880/btn_home2.png" alt="btn_home"> </button>
		</div>
		
	</div>
</div>

<style>
	.btn_gohome {
		background-image: url('http://abadinet.my.id:1880/btn1.png');
		background-size: cover;
	}
	.bg_siram {
		background-image: url('http://abadinet.my.id:1880/bg_siram.png');
		background-position: center;
		background-size: cover;
	}
</style>
