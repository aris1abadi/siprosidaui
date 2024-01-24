<script>
	export let showModal; // boolean
	export let timeOut = 2;

	let dialog; // HTMLDialogElement

	//$: if (dialog && showModal)dialog.showModal();

	$: if (dialog && showModal) {
		dialog.showModal();
		if(timeOut != 0)
			setTimeout(() =>{
				dialog.close()
				showModal = false;
			},(timeOut * 1000))
		
	};
	
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
	class="w-11/12"
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation>
		
		<slot />
		<hr />
		<!-- svelte-ignore a11y-autofocus -->
		<button class="w-full text-right text-red-700" autofocus on:click={() => dialog.close()}>Tutup</button>
	</div>
</dialog>

<style>
	dialog {
		max-width: 24em;
		border-radius: 0.2em;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 1.0s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.5);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
	}
</style>
