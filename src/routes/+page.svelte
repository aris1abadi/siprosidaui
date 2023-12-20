

<script >
	/*
	format jadwal sederhana
	text 3 blok jadwal
	enable,idx,jenis,H,M,s,s,r,k,j,s,m,l1,l2,l3,l4,A,P,T;enable,idx,jenis,H,M,s,s,r,k,j,s,m,l1,l2,l3,l4,A,P,T;enable,idx,jenis,H,M,s,s,r,k,j,s,m,l1,l2,l3,l4,A,P,T

	*/
	import { goto } from '$app/navigation';
	import { resetAllValue,firtLoad,demoMode } from '$lib/store/stores';
	import { onMount } from 'svelte';
	import Modal from '$lib/Modal.svelte';
	
	

	onMount(() =>{
		resetAllValue();

	})
	let myPassword = "";
	let showModal = false;

	function startSiprosida(){
		firtLoad.set(false);
		demoMode.set(false)
		if(myPassword === "bsip123"){
			goto('/home')
		}else{
			showModal = true;
		}
		
	}
	function startDemo(){
		firtLoad.set(false);
		demoMode.set(true)
		goto('/home')
	}
    

	
</script>

<div class="h-screen w-screen bg-zinc-800">
	<div class="bg_login h-full w-full max-w-md mx-auto bg-zinc-500 flex flex-col">
		<div class=" h-full w-full grid justify-items-center ">
			<div class="w-full h-80 mb-8"></div>
			<div class="w-3/4 h-32 bg-white rounded-lg mt-20 grid justify-items-center">
				<input type="text" placeholder="Tulis Passwordmu " bind:value={myPassword} class="input input-bordered input-secondary w-3/4 max-w-xs mt-4" />
				<div class="grid grid-cols-2 gap-4 py-2 w-3/4">
					<button on:click={() => startDemo()} class="border border-purple-900  border rounded w-full h-10  mt-2  "
						> DEMO</button
					>
					<button on:click={() => startSiprosida()} class="border border-purple-900 border bg-purple-900 rounded w-full h-10 mt-2 text-white"
						> START</button
					>
				</div>				
			
			</div>
			
			
		</div>
	</div>
</div>
<Modal bind:showModal>
	<div class="text-lg text-red-800 text-center">Password kamu salah</div>
</Modal>

<style>
	.bg_login {
		background-image: url('/bg_opening.png');		
        background-position: center;
		background-size:cover;
	}
	
</style>
