<script>
	import { goto } from '$app/navigation';

	let suhuUdara = 35.5;
	let KelembabanUdara = 60;
	let lengasTanah = 46;
	let suhuTanah = 27;
</script>

<div class="h-screen w-screen bg-zinc-800">
	<div class="mainbg h-full w-full max-w-md mx-auto flex flex-col">
		<div >
			<img src="http://abadinet.my.id:1880/hd_home.png" alt="hd_home" />
		</div>
		<div class="grid grid-cols-12 h-16 w-full ">
			<div class="col-span-2"></div>
			<div class="col-span-8 h-full bg-white rounded-lg mt-0 shadow-xl">
				<div class="grid grid-cols-3">
					<div>
						<div class="text-xs text-center mt-4"><small>Suhu</small></div>
						<div class="text-center font-bold">{suhuUdara}°C</div>
					</div>
					<div class="text-center">Udara</div>
					<div>
						<div class="text-xs text-center mt-4"><small>Kelembaban</small></div>
						<div class="text-center font-bold">{suhuUdara}%</div>
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
						<div class="text-center text-xs font-bold">{lengasTanah}%</div>
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
							<img src="http://abadinet.my.id:1880/btn_air1.png" alt="srm_on" />
						</div>
						<div class="swap-off">
							<img src="http://abadinet.my.id:1880/btn_air2.png" alt="srm_off" />
						</div>
					</label>

					<div class="h-1/2 w-1/2 mt-1 ml-1">
						<label class="swap swap-flip">
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
			<div class="col-span-2"></div>
		</div>

		<div class="grid grid-cols-11 gap-8 h-24 w-full mt-6">
			<div class="col-span-1"></div>
			<button on:click={() => goto('/siram')} class="col-span-3 h-full bg-white rounded-lg shadow-xl">
				<div class="text-xs font-bold text-center mt-1">
					<small>Penyiramam</small>
				</div>
				<div>
					<img src="http://abadinet.my.id:1880/btn_pest1.png" alt="siram" />
				</div>
			</button>
			<button on:click={() => goto('/pestisida')} class="col-span-3 h-full bg-white rounded-lg shadow-xl">
				<div class="text-xs font-bold text-center mt-1">
					<small>Pestisida</small>
				</div>
				<div>
					<img src="http://abadinet.my.id:1880/btn_pest2.png" alt="siram" />
				</div>
			</button>
			<button on:click={() => goto('/biopest')} class="col-span-3 h-full bg-white rounded-lg shadow-xl">
				<div class="text-xs font-bold text-center mt-1">
					<small>Biopest</small>
				</div>
				<div>
					<img src="http://abadinet.my.id:1880/btn_pest3.png" alt="siram" />
				</div>
			</button>
			<div class="col-span-1"></div>
		</div>
	</div>
</div>

<style>
	.mainbg {
		background-image: url('http://abadinet.my.id:1880/bg_home.png');		
		background-position: center;
		background-size: cover;
	}
</style>
