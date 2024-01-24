<script>
	/*
	format jadwal sederhana
	text 3 blok jadwal
	enable,idx,jenis,H,M,s,s,r,k,j,s,m,l1,l2,l3,l4,A,P,T;enable,idx,jenis,H,M,s,s,r,k,j,s,m,l1,l2,l3,l4,A,P,T;enable,idx,jenis,H,M,s,s,r,k,j,s,m,l1,l2,l3,l4,A,P,T

	*/
	import { goto } from '$app/navigation';
	import { resetAllValue, firtLoad, demoMode, conect_status, kontrolIDStore  } from '$lib/store/stores';
	import { onMount } from 'svelte';
	import Modal from '$lib/Modal.svelte';
	import { get } from 'svelte/store';
	import { kirimMsg } from '$lib/mqttHandle';
	let sts_count = 0;

	onMount(() => {
		resetAllValue();
		conect_status.set(false);

		
	});
	let myPassword = '';
	let showModal = false;
	

	function startSiprosida() {
		$firtLoad = false;
		if (myPassword === 'bsip123') {
			$demoMode = false;
			kirimMsg('kontrol',0,'login',myPassword);
			goto('/home');
		} else {
			showModal = true;
			setTimeout(() => {showModal = false},2000);
		}
	}
	function startDemo() {
		$firtLoad = false;
		$demoMode = true;
		goto('/home');
	}
</script>

<div class="h-screen w-screen bg-zinc-800">
	<div class="bg_login h-full w-full max-w-md mx-auto bg-zinc-500 flex flex-col">
		<div class=" h-full w-full grid justify-items-center">
			<div class="w-full h-80 mb-8"></div>

			<div class="w-3/4 h-32 bg-white rounded-lg mt-20 grid justify-items-center">
				<input
					type="password"
					placeholder="Tulis Passwordmu "
					bind:value={myPassword}
					class="input input-bordered input-secondary w-3/4 h-10 max-w-xs mt-4"
				/>
				<div class="grid grid-cols-2 gap-4 py-2 w-3/4">
					<button
						on:click={() => startDemo()}
						class="border border-purple-900 border rounded w-full h-10 mt-2"
					>
						DEMO</button
					>
					
						<button
							on:click={() => startSiprosida()}
							class="border border-purple-900 bg-purple-900 rounded w-full h-10 mt-2 text-white"
						>
							LOGIN
						</button>
					
				</div>
			</div>
		</div>
		<div class="text-xs w-full text-center mt-4">{get(kontrolIDStore)}</div>
	</div>
	
</div>
<Modal bind:showModal>
	<div class="text-lg text-red-800 text-center">Password kamu salah</div>
</Modal>

<style>
	.bg_login {
		background-image: url('/bg_opening.png');
		background-position: center;
		background-size: cover;
	}
</style>
