<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
    

	let textfield = '';
	let username = '';

	let messages = [];

	function sendMessage() {
		const message = textfield.trim();
		if (!message) return;

		textfield = '';
	}
</script>

<div class="h-screen w-screen bg-zinc-800">
	<div class="h-full w-full max-w-md mx-auto bg-zinc-500 flex flex-col">
		<div class="bg_login h-full w-full grid justify-items-center ">
			<div class="w-full h-80 mb-8"></div>
			<div class="w-3/4 h-32 bg-white rounded-lg mt-20 grid justify-items-center">
				<input type="text" placeholder="Tulis Passwordmu " class="input input-bordered input-secondary w-3/4 max-w-xs mt-4" />
				<button on:click={() => goto('/home')} class="btn_letsgo w-12 h-12 mt-2 "
					></button
				>
			
			</div>
			
			
		</div>
	</div>
</div>

<style>
	.bg_login {
		background-image: url('http://abadinet.my.id:1880/sampul.png');		
        background-position: center;
		background-size:cover;
	}
	.btn_letsgo {
		background-image: url('http://abadinet.my.id:1880/btn1.png');
		background-size: cover;
	}
</style>
