<script>
	import { goto } from '$app/navigation';
	import { kirimMsg } from '$lib/mqttHandle';

	import {
		resetAllValue,
		demoMode,
		runMode,
		conect_status,
		lahan1_status,
		lahan2_status,
		lahan3_status,
		lahan4_status,
		kontrolIDStore,
		clientIDStore,
		lengas1raw,
		lengas2raw,
		lengas3raw,
		lengas4raw,
		kalibrasiPestisida,
		kalibrasiAirPestisida,
		kalibrasiBiopest,
		kalibrasiAirBiopest,
		brokerUseStore,
		brokerPortUseStore,
		ble_connected,
		wifiSSIDStore,
		wifiPasswordStore
	} from '$lib/store/stores';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import Modal from '$lib/Modal.svelte';
	import { ble_connect } from '$lib/bleHandle';

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

	let kontrolId_value = '';
	let prefixBroker_value = 'wss://'
	let postfixBroker_value = '/mqtt'
	let brokerUse_value = 'Pilih Server';
	let brokerPortUse_value = '';
	let wifiSSID_value ='---';
	let wifiPassword_value = 'xxxx';

	let kalibrasiPestisida_value = 10;
	let kalibrasiAirPestisida_value = 10;

	let kalibrasiBiopest_value = 10;
	let kalibrasiAirBiopest_value = 10;

	let pilihKalibrasi = 0;

	let showMode = 0;
	let showModal = false;
	let alertType = 0;
	let timeOut = 0;

	let set0_1 = 600;
	let set0_2 = 600;
	let set0_3 = 600;
	let set0_4 = 600;

	let set100_1 = 300;
	let set100_2 = 300;
	let set100_3 = 300;
	let set100_4 = 300;

	let username = '';
	let password = '';
	let newPassword1 = '';
	let newPassword2 = '';

	let kal_lengas1 = false;
	let kal_lengas2 = false;
	let kal_lengas3 = false;
	let kal_lengas4 = false;

	let suhuTanah = '-';
	let files;

	onMount(() => {
		resetAllValue();
		getAllStatus();
		setTimeout(getKalibrasiPestisida, 1000);
		setTimeout(getKalibrasiBiopest, 2000);
	});

	function getKalibrasiPestisida() {
		kirimMsg('pestisida', 0, 'getKalibrasi', '1');
	}

	function getKalibrasiBiopest() {
		kirimMsg('biopest', 0, 'getKalibrasi', '1');
	}

	function selenoidLahan(lahan, val) {
		if (!$demoMode) {
			if ($conect_status || $ble_connected) {
				if (val) {
					kirimMsg('selenoid', lahan, 'lahan', '1');
				} else {
					kirimMsg('selenoid', lahan, 'lahan', '0');
				}
			} else {
				alertConect();
			}
		} else {
			alertDemo();
		}
	}

	function simpanId() {
		if (kontrolId_value === '') {
			alert('kontrolId tidak boleh kosong');
		} else {
			kontrolIDStore.set(kontrolId_value);
			alert('kontrolID ' + kontrolId_value + ' disimpan');
		}
	}

	function simpanBroker() {
		
		if(brokerUse_value === 'Server 1'){
			brokerUseStore.set('ws://mqtt.eclipseprojects.io/mqtt')
			brokerPortUseStore.set('80')

		}else if(brokerUse_value === 'Server 2'){
			brokerUseStore.set('wss://mqtt.eclipseprojects.io/mqtt')
			brokerPortUseStore.set('443')

		}else if(brokerUse_value === 'Server 3'){
			brokerUseStore.set('ws://broker.hivemq.com/')
			brokerPortUseStore.set('8000')
		}

		/*
		if (brokerUse_value === '') {
			alert('Server tidak boleh kosong\n');
		} else {
			brokerUseStore.set(brokerUse_value);
			brokerPortUseStore.set(brokerPortUse_value);
			let brokerMsg = brokerUse_value + '~' + brokerPortUse_value;
			kirimMsg('kontrol', 0, 'setupBroker', brokerMsg);
			alert('Server ' + brokerUse_value + 'port: ' + brokerPortUse_value + ' disimpan');
		}
		*/
	}

	function simpanWifi(){
		if (wifiSSID_value === '') {
			alert('SSID tidak boleh kosong\n');
		} else {
			
			let wifiMsg = wifiSSID_value + '~' + wifiPassword_value;
			kirimMsg('kontrol', 0, 'setupWifi', wifiMsg);
			alert('Wifi ' + wifiSSID_value + 'port: ' + wifiPassword_value + ' disimpan');
		}
	}

	function pompaTes(val) {
		if (!$demoMode) {
			if ($conect_status || $ble_connected) {
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
			} else {
				alertConect();
			}
		} else {
			alertDemo();
		}
	}

	function selenoidTes(val) {
		if (!$demoMode) {
			if ($conect_status || $ble_connected) {
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
			} else {
				alertConect();
			}
		} else {
			alertDemo();
		}
	}

	function getAllStatus() {
		kirimMsg('kontrol', 0, 'getAllStatus', '0');
	}

	function kalibrasiPestisida_start() {
		if (!$demoMode) {
			if ($conect_status || $ble_connected) {
				kirimMsg('pestisida', 0, 'kalibrasi', String($kalibrasiPestisida));
			} else {
				alertConect();
			}
		} else {
			alertDemo();
		}
	}

	function kalibrasiAirPestisida_start() {
		if (!$demoMode) {
			if ($conect_status || $ble_connected) {
				kirimMsg('pestisida', 0, 'kalibrasiAir', String($kalibrasiAirPestisida));
			} else {
				alertConect();
			}
		} else {
			alertDemo();
		}
	}

	function simpanKalibrasi_pestisida() {
		if (!$demoMode) {
			if ($conect_status || $ble_connected) {
				kirimMsg('pestisida', 0, 'simpanKalibrasi', String($kalibrasiPestisida));
			} else {
				alertConect();
			}
		} else {
			alertDemo();
		}
	}

	function simpanKalibrasiAir_pestisida() {
		if (!$demoMode) {
			if ($conect_status || $ble_connected) {
				kirimMsg('pestisida', 0, 'simpanKalibrasiAir', String($kalibrasiAirPestisida));
			} else {
				alertConect();
			}
		} else {
			alertDemo();
		}
	}

	function kalibrasiBiopest_start() {
		if (!$demoMode) {
			if ($conect_status || $ble_connected) {
				kirimMsg('biopest', 0, 'kalibrasi', String($kalibrasiBiopest));
			} else {
				alertConect();
			}
		} else {
			alertDemo();
		}
	}

	function kalibrasiAirBiopest_start() {
		if (!$demoMode) {
			if ($conect_status || $ble_connected) {
				kirimMsg('biopest', 0, 'kalibrasiAir', String($kalibrasiAirBiopest));
			} else {
				alertConect();
			}
		} else {
			alertDemo();
		}
	}

	function simpanKalibrasi_biopest() {
		if (!$demoMode) {
			if ($conect_status || $ble_connected) {
				kirimMsg('biopest', 0, 'simpanKalibrasi', String($kalibrasiBiopest));
			} else {
				alertConect();
			}
		} else {
			alertDemo();
		}
	}

	function simpanKalibrasiAir_biopest() {
		if (!$demoMode) {
			if ($conect_status || $ble_connected) {
				kirimMsg('biopest', 0, 'simpanKalibrasiAir', String($kalibrasiAirBiopest));
			} else {
				alertConect();
			}
		} else {
			alertDemo();
		}
	}

	function kalibrasiLengas_start(lengas) {
		if (!$demoMode) {
			if ($conect_status || $ble_connected) {
				switch (lengas) {
					case 1:
						if (kal_lengas1) {
							//kirimMsg('lengas', 1, 'setInterval', '1');
							kirimMsg('lengas', 1, 'setInterval', '1');
						} else {
							kirimMsg('lengas', 1, 'setInterval', '60');
						}

						break;

					case 2:
						if (kal_lengas2) {
							//kirimMsg('lengas', 1, 'setInterval', '1');
							kirimMsg('lengas', 2, 'setInterval', '1');
						} else {
							kirimMsg('lengas', 2, 'setInterval', '60');
						}

						break;

					case 3:
						if (kal_lengas3) {
							//kirimMsg('lengas', 1, 'setInterval', '1');
							kirimMsg('lengas', 3, 'setInterval', '1');
						} else {
							kirimMsg('lengas', 3, 'setInterval', '60');
						}

						break;

					case 4:
						if (kal_lengas4) {
							//kirimMsg('lengas', 1, 'setInterval', '1');
							kirimMsg('lengas', 4, 'setInterval', '1');
						} else {
							kirimMsg('lengas', 4, 'setInterval', '60');
						}

						break;
				}
			} else {
				alertConect();
			}
		} else {
			alertDemo();
		}
	}

	function simpanKalibrasiLengas(lengas) {
		if (!$demoMode) {
			if ($conect_status || $ble_connected) {
				switch (lengas) {
					case 1:
						kirimMsg('lengas', 1, 'set100', String(set100_1));
						setTimeout(() => {
							kirimMsg('lengas', 1, 'set0', String(set0_1));
						}, 1000);

						break;

					case 2:
						kirimMsg('lengas', 2, 'set100', String(set100_2));
						setTimeout(() => {
							kirimMsg('lengas', 2, 'set0', String(set0_2));
						}, 1000);

						break;

					case 3:
						kirimMsg('lengas', 3, 'set100', String(set100_3));
						setTimeout(() => {
							kirimMsg('lengas', 3, 'set0', String(set0_3));
						}, 1000);

						break;

					case 4:
						kirimMsg('lengas', 4, 'set100', String(set100_4));
						setTimeout(() => {
							kirimMsg('lengas', 4, 'set0', String(set0_4));
						}, 1000);

						break;
				}
			} else {
				alertConect();
			}
		} else {
			alertDemo();
		}
	}

	function alertDemo() {
		showModal = true;
		showMode = 3;
		alertType = 1;
		timeOut = 2;
	}
	function alertConect() {
		showModal = true;
		showMode = 3;
		alertType = 2;
	}

	let responseMessage = '';

	async function handleSubmit() {
		const formData = new FormData();
		formData.append('fileToUpload', files[0]);
		formData.append('kontrolID', get(kontrolIDStore));

		try {
			const response = await fetch('/setup', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				//{type: 'success', status: 200, data: '[{"status":1,"success":2,"body":3},200,true,{"nama…ad/SP7652_firmware.bin","File berhasil disimpan"]'}
				const result = await response.json();
				const data = JSON.parse(result.data);
				//console.log(result.data[0])
				console.log(data[data[0].pesan]);
				console.log(data[data[0].path]);
			} else {
				responseMessage = 'Gagal mengunggah file';
			}
		} catch (error) {
			console.error('Error:', error);
			responseMessage = 'Terjadi kesalahan saat mengunggah file';
			console.log(responseMessage);
		}
	}

	function handleFileChange(event) {
		files = event.target.files;
	}
</script>

<link
	rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
/>

<div class="h-screen w-screen bg-zinc-800">
	<div class="mainbg h-full w-full max-w-md mx-auto flex flex-col">
		<div class="hd_home w-full h-16">
			<div class="text-xs w-full text-center mt-12">{get(kontrolIDStore)} ~ {get(clientIDStore)}</div>
			<div class="w-full h-4 grid justify-items-center mb-2">
				{#if $demoMode}
					<div class="text-center text-xs bg-red-500 text-white w-12 h-4"><small>Demo</small></div>
				{:else if $ble_connected}
					<div class="text-center text-xs bg-blue-900 text-white w-12 h-4">
						<small>Bluethoot</small>
					</div>
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
		</div>

		<!--tab menu setup-->
		<div class="w-full p-2 mt-8">
			<div role="tablist" class="tabs tabs-lifted">
				<!--tab Kalibrasi-->
				<input
					type="radio"
					name="my_tabs_2"
					role="tab"
					class="tab text-xs"
					aria-label="Kalibrasi"
				/>
				<div role="tabpanel" class="tab-content bg-base-100 p-2">
					<div class="grid grid-cols-3 w-3/4 h-6 my-4">
						<button
							on:click={() => (pilihKalibrasi = 0)}
							class={pilihKalibrasi === 0
								? 'border bg-gray-700 text-white text-xs'
								: 'border text-black text-xs'}>Pestisida</button
						>
						<button
							on:click={() => (pilihKalibrasi = 1)}
							class={pilihKalibrasi === 1
								? 'border bg-gray-700 text-white text-xs'
								: 'border text-black text-xs'}>Biopest</button
						>
						<button
							on:click={() => (pilihKalibrasi = 2)}
							class={pilihKalibrasi === 2
								? 'border bg-gray-700 text-white text-xs'
								: 'border text-black text-xs'}>Lengas</button
						>
					</div>
					{#if pilihKalibrasi === 0}
						<!--pestisida-->
						<div class="grid grid-cols-8 border gap-2 bg-blue-100">
							<div
								class="col-span-8 h-6 mb-4 bg-[#0000ff] text-white text-center text-xs font-bold pt-1"
							>
								Kalibrasi pestisida 10 mL
							</div>

							<input
								class="col-span-3 ml-2 mb-2 range range-xs range-primary"
								type="range"
								min="1"
								max="20"
								bind:value={$kalibrasiPestisida}
							/>
							<button class="h-6 mb-2 text-center">{$kalibrasiPestisida}</button>
							<button
								on:click={() => kalibrasiPestisida_start()}
								class="col-span-2 h-6 mb-2 border border-gray-400 rounded text-xs">Mulai</button
							>
							<button
								class="col-span-2 h-6 mr-2 mb-4 border bg-[#0000ff] text-white text-xs rounded"
								on:click={() => simpanKalibrasi_pestisida()}>Simpan</button
							>
						</div>

						<div class="grid grid-cols-8 border gap-2 bg-blue-100 mt-8">
							<div
								class="col-span-8 h-6 mb-4 bg-[#0000ff] text-white text-center text-xs font-bold pt-1"
							>
								Kalibrasi Air Pestisida 3 liter
							</div>

							<input
								class="col-span-3 ml-2 mb-2 range range-xs range-primary"
								type="range"
								min="1"
								max="20"
								bind:value={$kalibrasiAirPestisida}
							/>
							<button class="h-6 mb-2 text-center">{$kalibrasiAirPestisida}</button>
							<button
								on:click={() => kalibrasiAirPestisida_start()}
								class="col-span-2 h-6 mb-2 border border-gray-400 rounded text-xs">Mulai</button
							>
							<button
								class="col-span-2 h-6 mr-2 mb-4 border bg-[#0000ff] text-white text-xs rounded"
								on:click={() => simpanKalibrasiAir_pestisida()}>Simpan</button
							>
						</div>
					{:else if pilihKalibrasi === 1}
						<!--biopest-->
						<div class="grid grid-cols-8 border gap-2 bg-green-100">
							<div
								class="col-span-8 h-6 mb-4 bg-[#009900] text-white text-center text-xs font-bold pt-1"
							>
								Kalibrasi Biopestisida 10 mL
							</div>

							<input
								class="col-span-3 ml-2 mb-2 range range-xs range-success"
								type="range"
								min="1"
								max="20"
								bind:value={$kalibrasiBiopest}
							/>
							<button class="h-6 mb-2 text-center">{$kalibrasiBiopest}</button>
							<button
								on:click={() => kalibrasiBiopest_start()}
								class="col-span-2 h-6 mb-2 border border-gray-400 rounded text-xs">Mulai</button
							>
							<button
								on:click={() => simpanKalibrasi_biopest()}
								class="col-span-2 h-6 mr-2 mb-4 border bg-[#009900] text-white text-xs rounded"
								>Simpan</button
							>
						</div>

						<div class="grid grid-cols-8 border gap-2 bg-green-100 mt-8">
							<div
								class="col-span-8 h-6 mb-4 bg-[#009900] text-white text-center text-xs font-bold pt-1"
							>
								Kalibrasi Air Biopestisida 3 liter
							</div>

							<input
								class="col-span-3 ml-2 mb-2 range range-xs range-success"
								type="range"
								min="1"
								max="20"
								bind:value={$kalibrasiAirBiopest}
							/>
							<button class="h-6 mb-2 text-center">{$kalibrasiAirBiopest}</button>
							<button
								on:click={() => kalibrasiAirBiopest_start()}
								class="col-span-2 h-6 mb-2 border border-gray-400 rounded text-xs">Mulai</button
							>
							<button
								on:click={() => simpanKalibrasiAir_biopest()}
								class="col-span-2 h-6 mr-2 mb-4 border bg-[#009900] text-white text-xs rounded"
								>Simpan</button
							>
						</div>
					{:else if pilihKalibrasi === 2}
						<!--kalibrasi sensor lengas-->
						<div class="grid grid-cols-2 gap-2">
							<!--kalibrasi lengas1-->
							<div class="border border-gray-400 rounded grid grid-cols-3 gap-4 p-2 bg-gray-200">
								<label class="form-control w-full text-[10px]">
									Set 0%
									<input
										type="number"
										bind:value={set0_1}
										placeholder="---"
										class="border border-gray-400 rounded text-center text-xs w-full h-6"
									/>
								</label>
								<label class="form-control w-full text-[10px]">
									100%

									<input
										type="number"
										bind:value={set100_1}
										placeholder="---"
										class="border border-gray-400 rounded text-center text-xs w-full h-6"
									/>
								</label>
								<div class="text-lg text-center mt-4">{$lengas1raw}</div>
								<div class="col-span-3 grid grid-cols-2 gap-4">
									<button
										on:click={() => simpanKalibrasiLengas(1)}
										class="mt-2 border border-gray-400 bg-green-800 text-xs text-white w-full h-8"
									>
										Simpan</button
									>

									<label class="swap h-12 w-full text-center text-[10px]">
										<input
											type="checkbox"
											bind:checked={kal_lengas1}
											on:change={() => kalibrasiLengas_start(1)}
										/>
										<div class="swap-on h-6 w-12">
											<img src=" /on6.png" alt="btn_on" />
										</div>
										<div class="swap-off h-6 w-12">
											<img src=" /off6.png" alt="btn_off" />
										</div>
									</label>
								</div>
							</div>

							<!--kalibrasi lengas2-->
							<div class="border border-gray-400 rounded grid grid-cols-3 gap-4 p-2 bg-gray-200">
								<label class="form-control w-full text-[10px]">
									Set 0%
									<input
										type="number"
										bind:value={set0_2}
										placeholder="---"
										class="border border-gray-400 rounded text-center text-xs w-full h-6"
									/>
								</label>
								<label class="form-control w-full text-[10px]">
									100%

									<input
										type="number"
										bind:value={set100_2}
										placeholder="---"
										class="border border-gray-400 rounded text-center text-xs w-full h-6"
									/>
								</label>
								<div class="text-lg text-center mt-4">{$lengas2raw}</div>
								<div class="col-span-3 grid grid-cols-2 gap-4">
									<button
										on:click={() => simpanKalibrasiLengas(2)}
										class="mt-2 border border-gray-400 bg-green-800 text-xs text-white w-full h-8"
									>
										Simpan</button
									>

									<label class="swap h-12 w-full text-center text-[10px]">
										<input
											type="checkbox"
											bind:checked={kal_lengas2}
											on:change={() => kalibrasiLengas_start(2)}
										/>
										<div class="swap-on h-6 w-12">
											<img src=" /on6.png" alt="btn_on" />
										</div>
										<div class="swap-off h-6 w-12">
											<img src=" /off6.png" alt="btn_off" />
										</div>
									</label>
								</div>
							</div>

							<!--kalibrasi lengas3-->
							<div class="border border-gray-400 rounded grid grid-cols-3 gap-4 p-2 bg-gray-200">
								<label class="form-control w-full text-[10px]">
									Set 0%
									<input
										type="number"
										bind:value={set0_3}
										placeholder="---"
										class="border border-gray-400 rounded text-center text-xs w-full h-6"
									/>
								</label>
								<label class="form-control w-full text-[10px]">
									100%

									<input
										type="number"
										bind:value={set100_3}
										placeholder="---"
										class="border border-gray-400 rounded text-center text-xs w-full h-6"
									/>
								</label>
								<div class="text-lg text-center mt-4">{$lengas3raw}</div>
								<div class="col-span-3 grid grid-cols-2 gap-4">
									<button
										on:click={() => simpanKalibrasiLengas(3)}
										class="mt-2 border border-gray-400 bg-green-800 text-xs text-white w-full h-8"
									>
										Simpan</button
									>

									<label class="swap h-12 w-full text-center text-[10px]">
										<input
											type="checkbox"
											bind:checked={kal_lengas3}
											on:change={() => kalibrasiLengas_start(3)}
										/>
										<div class="swap-on h-6 w-12">
											<img src=" /on6.png" alt="btn_on" />
										</div>
										<div class="swap-off h-6 w-12">
											<img src=" /off6.png" alt="btn_off" />
										</div>
									</label>
								</div>
							</div>

							<!--kalibrasi lengas4-->
							<div class="border border-gray-400 rounded grid grid-cols-3 gap-4 p-2 bg-gray-200">
								<label class="form-control w-full text-[10px]">
									Set 0%
									<input
										type="number"
										bind:value={set0_4}
										placeholder="---"
										class="border border-gray-400 rounded text-center text-xs w-full h-6"
									/>
								</label>
								<label class="form-control w-full text-[10px]">
									100%

									<input
										type="number"
										bind:value={set100_4}
										placeholder="---"
										class="border border-gray-400 rounded text-center text-xs w-full h-6"
									/>
								</label>
								<div class="text-lg text-center mt-4">{$lengas4raw}</div>
								<div class="col-span-3 grid grid-cols-2 gap-4">
									<button
										on:click={() => simpanKalibrasiLengas(4)}
										class="mt-2 border border-gray-400 bg-green-800 text-xs text-white w-full h-8"
									>
										Simpan</button
									>

									<label class="swap h-12 w-full text-center text-[10px]">
										<input
											type="checkbox"
											bind:checked={kal_lengas4}
											on:change={() => kalibrasiLengas_start(4)}
										/>
										<div class="swap-on h-6 w-12">
											<img src=" /on6.png" alt="btn_on" />
										</div>
										<div class="swap-off h-6 w-12">
											<img src=" /off6.png" alt="btn_off" />
										</div>
									</label>
								</div>
							</div>
						</div>
					{/if}
				</div>

				<!--tab kontrol-->
				<input
					checked
					type="radio"
					name="my_tabs_2"
					role="tab"
					class="tab text-xs"
					aria-label="Kontrol"
				/>
				<div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-2">
					<div class="grid grid-cols-2 gap-4">
						<!--lahan-->
						<div class="grid grid-cols-2 border p-1 border-gray-400 rounded">
							<div class="col-span-2 text-[12px] font-bold text-center mb-2">Selenoid Lahan</div>
							<label class="swap h-12 w-full text-center text-[10px]"
								>Lahan1
								<input
									type="checkbox"
									bind:checked={$lahan1_status}
									on:change={() => selenoidLahan(1, $lahan1_status)}
								/>
								<div class="swap-on h-6 w-12">
									<img src=" /on6.png" alt="btn_on" />
								</div>
								<div class="swap-off h-6 w-12">
									<img src=" /off6.png" alt="btn_off" />
								</div>
							</label>

							<label class="swap h-12 w-full text-center text-[10px]"
								>Lahan2
								<input
									type="checkbox"
									bind:checked={$lahan2_status}
									on:change={() => selenoidLahan(2, $lahan2_status)}
								/>
								<div class="swap-on h-6 w-12">
									<img src=" /on6.png" alt="btn_on" />
								</div>
								<div class="swap-off h-6 w-12">
									<img src=" /off6.png" alt="btn_off" />
								</div>
							</label>

							<label class="swap h-12 w-full text-center text-[10px]"
								>Lahan3
								<input
									type="checkbox"
									bind:checked={$lahan3_status}
									on:change={() => selenoidLahan(3, $lahan3_status)}
								/>
								<div class="swap-on h-6 w-12">
									<img src=" /on6.png" alt="btn_on" />
								</div>
								<div class="swap-off h-6 w-12">
									<img src=" /off6.png" alt="btn_off" />
								</div>
							</label>
							<label class="swap h-12 w-full text-center text-[10px]"
								>Lahan4
								<input
									type="checkbox"
									bind:checked={$lahan4_status}
									on:change={() => selenoidLahan(4, $lahan4_status)}
								/>
								<div class="swap-on h-6 w-12">
									<img src=" /on6.png" alt="btn_on" />
								</div>
								<div class="swap-off h-6 w-12">
									<img src=" /off6.png" alt="btn_off" />
								</div>
							</label>
						</div>
						<!--pompa-->
						<div class="grid grid-cols-2 gap-2 border p-1 border-gray-400 rounded">
							<div class="col-span-2 text-center font-bold text-xs">Pompa</div>
							<div
								class="w-full h-20 mt-2 grid justify-items-center text-xs font-bold rounded shadow-lg border border-gray-200"
							>
								<small>Semprot</small>
								<label class="swap h-12 w-12">
									<!-- this hidden checkbox controls the state -->
									<input
										type="checkbox"
										bind:checked={pompaSemprot_sts}
										on:change={() => pompaTes(2)}
									/>
									<div class="swap-on">
										<img src=" /on4.png" alt="btn_on" />
									</div>
									<div class="swap-off">
										<img src=" /off4.png" alt="btn_off" />
									</div>
								</label>
							</div>

							<div
								class="w-full h-20 mt-2 text-xs font-bold grid justify-items-center rounded shadow-lg border border-gray-200"
							>
								<small>Utama</small>
								<label class="swap h-12 w-12">
									<!-- this hidden checkbox controls the state -->
									<input
										type="checkbox"
										bind:checked={pompaUtama_sts}
										on:change={() => pompaTes(1)}
									/>
									<div class="swap-on">
										<img src=" /on4.png" alt="btn_on" />
									</div>
									<div class="swap-off">
										<img src=" /off4.png" alt="btn_off" />
									</div>
								</label>
							</div>
						</div>

						<!--pestisida-->
						<div class="grid grid-cols-2 border p-1 border-gray-400 rounded">
							<div class="col-span-2 text-[12px] font-bold text-center mb-2">Pestisida</div>
							<label class="swap h-12 w-full text-center text-[10px]"
								>Pompa
								<input
									type="checkbox"
									bind:checked={pompaPestisida_sts}
									on:change={() => pompaTes(3)}
								/>
								<div class="swap-on h-6 w-12">
									<img src=" /on6.png" alt="btn_on" />
								</div>
								<div class="swap-off h-6 w-12">
									<img src=" /off6.png" alt="btn_off" />
								</div>
							</label>

							<label class="swap h-12 w-full text-center text-[10px]"
								>Aduk
								<input
									type="checkbox"
									bind:checked={pompaAdukPestisida_sts}
									on:change={() => pompaTes(4)}
								/>
								<div class="swap-on h-6 w-12">
									<img src=" /on6.png" alt="btn_on" />
								</div>
								<div class="swap-off h-6 w-12">
									<img src=" /off6.png" alt="btn_off" />
								</div>
							</label>

							<label class="swap h-12 w-full text-center text-[10px]"
								>Inlet
								<input
									type="checkbox"
									bind:checked={selenoidInletPestisida_sts}
									on:change={() => selenoidTes(1)}
								/>
								<div class="swap-on h-6 w-12">
									<img src=" /on6.png" alt="btn_on" />
								</div>
								<div class="swap-off h-6 w-12">
									<img src=" /off6.png" alt="btn_off" />
								</div>
							</label>
							<label class="swap h-12 w-full text-center text-[10px]"
								>Outlet
								<input
									type="checkbox"
									bind:checked={selenoidOutletPestisida_sts}
									on:change={() => selenoidTes(2)}
								/>
								<div class="swap-on h-6 w-12">
									<img src=" /on6.png" alt="btn_on" />
								</div>
								<div class="swap-off h-6 w-12">
									<img src=" /off6.png" alt="btn_off" />
								</div>
							</label>
						</div>

						<!--biopest-->
						<div class="grid grid-cols-2 border p-1 border-gray-400 rounded">
							<div class="col-span-2 text-[12px] font-bold text-center mb-2">Biopestisida</div>
							<label class="swap h-12 w-full text-center text-[10px]"
								>Pompa
								<input
									type="checkbox"
									bind:checked={pompaBiopest_sts}
									on:change={() => pompaTes(5)}
								/>
								<div class="swap-on h-6 w-12">
									<img src=" /on6.png" alt="btn_on" />
								</div>
								<div class="swap-off h-6 w-12">
									<img src=" /off6.png" alt="btn_off" />
								</div>
							</label>

							<label class="swap h-12 w-full text-center text-[10px]"
								>Aduk
								<input
									type="checkbox"
									bind:checked={pompaAdukBiopest_sts}
									on:change={() => pompaTes(6)}
								/>
								<div class="swap-on h-6 w-12">
									<img src=" /on6.png" alt="btn_on" />
								</div>
								<div class="swap-off h-6 w-12">
									<img src=" /off6.png" alt="btn_off" />
								</div>
							</label>

							<label class="swap h-12 w-full text-center text-[10px]"
								>Inlet
								<input
									type="checkbox"
									bind:checked={selenoidInletBiopest_sts}
									on:change={() => selenoidTes(3)}
								/>
								<div class="swap-on h-6 w-12">
									<img src=" /on6.png" alt="btn_on" />
								</div>
								<div class="swap-off h-6 w-12">
									<img src=" /off6.png" alt="btn_off" />
								</div>
							</label>
							<label class="swap h-12 w-full text-center text-[10px]"
								>Outlet
								<input
									type="checkbox"
									bind:checked={selenoidOutletBiopest_sts}
									on:change={() => selenoidTes(4)}
								/>
								<div class="swap-on h-6 w-12">
									<img src=" /on6.png" alt="btn_on" />
								</div>
								<div class="swap-off h-6 w-12">
									<img src=" /off6.png" alt="btn_off" />
								</div>
							</label>
						</div>
					</div>
				</div>

				<!--tab admin-->
				<input type="radio" name="my_tabs_2" role="tab" class="tab text-xs" aria-label="admin" />
				<div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-2">
					<div class=" w-full h-10 p-2 mt-4 grid grid-cols-4 gap-2 bg-base-100 border">
						<div class="text-center">KontrolID</div>
						<input
							class="w-full h-6 border border-black rounded text-center text-[12px] "
							type="text"
							placeholder={get(kontrolIDStore)}
							bind:value={kontrolId_value}
						/>

						<button
							on:click={() => simpanId()}
							class="w-full h-6 border bg-green-500 rounded border-green-900">Simpan</button
						>
					</div>

					<div class=" w-full h-20 p-2 gap-1 bg-base-100 border mt-2">
						<label class="form-control w-full max-w-xs h-6">								
							<select class="select select-bordered " bind:value={brokerUse_value} on:change={() => simpanBroker()}>
							  <option disabled selected>Pilih Server</option>
							  <option>Server 1</option>
							  <option>Server 2</option>
							  <option>Server 3</option>								  
							</select>							
						  </label>
					</div>
					
					<div class="w-full border mt-4 p-4 grid justify-items-center">
						<form on:submit|preventDefault={handleSubmit}>
							<input type="file" on:change={handleFileChange} />
							<button type="submit">Upload</button>
						</form>

						{#if responseMessage}
							<p>{responseMessage}</p>
						{/if}
					</div>
				</div>

				<!-- tab ble-->
				<input
					type="radio"
					name="my_tabs_2"
					role="tab"
					class="tab text-xs"
					aria-label="Bluethoot"
				/>
				<div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-2">
					<button
						on:click={() => ble_connect()}
						class={$ble_connected
							? 'w-full h-8 border bg-blue-900 rounded border-blue-200 text-white'
							: 'w-full h-8 border bg-blue-100 rounded border-blue-900 text-blue'}
					>
						{#if !$ble_connected}
							Sambungkan ke Kontroller
						{:else}
							Putus Kontroller
						{/if}
					</button>
					{#if $ble_connected}					

						<div class=" w-full h-30 p-2 grid grid-cols-4 gap-2 bg-base-100 border mt-2">
							
							<div class="text-left col-span-2 text-xs">WIFI SSID</div>
							<div class="text-left col-span-2 text-xs">Password</div>
							<input
								class="w-full h-6 col-span-2 border border-black rounded text-center"
								type="text"
								placeholder={$wifiSSIDStore}
								bind:value={wifiSSID_value}
							/>
							<input
								class="w-full h-6 col-span-2 border border-black rounded text-center"
								type="text"
								placeholder={$wifiPasswordStore}
								bind:value={wifiPassword_value}
							/>

							<button
								on:click={() => simpanWifi()}
								class="w-full h-6 border col-span-4 bg-green-500 rounded border-green-900">Simpan WiFi</button
							>
						</div>
						<div class="w-full border mt-2 p-2 grid grid-cols-2 gap-4">
							<div>
								<label class="form-control w-full text-[10px]">
									Nama User
									<input
										type="text"
										bind:value={username}
										placeholder="---"
										class="border border-gray-400 rounded text-center text-xs w-full h-6"
									/>
								</label>
								</div>
								<div>
								<label class="form-control w-full text-[10px]">
									Password
									<input
										type="text"
										bind:value={password}
										placeholder="---"
										class="border border-gray-400 rounded text-center text-xs w-full h-6"
									/>
								</label>
								</div>
								<div>

								<label class="form-control w-full text-[10px]">
									Password baru
									<input
										type="text"
										bind:value={newPassword1}
										placeholder="---"
										class="border border-gray-400 rounded text-center text-xs w-full h-6"
									/>
								</label>
								</div>
								<div>
								<label class="form-control w-full text-[10px]">
									Password baru(ulang)
									<input
										type="text"
										bind:value={newPassword2}
										placeholder="---"
										class="border border-gray-400 rounded text-center text-xs w-full h-6"
									/>
								</label>
								</div>
								<button class="border border-gray-400 rounded col-span-2 text-center text-xs w-full h-8 mt-2"
									>Simpan</button 
								>
							
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!--menu-->
		<details class="dropdown w-full mt-4 pr-4 dropdown-top dropdown-end">
			<summary class="flex justify-end"
				><svg
					fill="#000000"
					class="w-8 h-8"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					viewBox="-5.6 -5.6 67.20 67.20"
					xml:space="preserve"
					stroke="#000000"
					stroke-width="0.00056"
					><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
						id="SVGRepo_tracerCarrier"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke="#CCCCCC"
						stroke-width="7.839999999999999"
					>
						<path
							d="M28,0C12.561,0,0,12.561,0,28s12.561,28,28,28s28-12.561,28-28S43.439,0,28,0z M40,41H16c-1.104,0-2-0.896-2-2s0.896-2,2-2 h24c1.104,0,2,0.896,2,2S41.104,41,40,41z M40,30H16c-1.104,0-2-0.896-2-2s0.896-2,2-2h24c1.104,0,2,0.896,2,2S41.104,30,40,30z M40,19H16c-1.104,0-2-0.896-2-2s0.896-2,2-2h24c1.104,0,2,0.896,2,2S41.104,19,40,19z"
						></path>
					</g><g id="SVGRepo_iconCarrier">
						<path
							d="M28,0C12.561,0,0,12.561,0,28s12.561,28,28,28s28-12.561,28-28S43.439,0,28,0z M40,41H16c-1.104,0-2-0.896-2-2s0.896-2,2-2 h24c1.104,0,2,0.896,2,2S41.104,41,40,41z M40,30H16c-1.104,0-2-0.896-2-2s0.896-2,2-2h24c1.104,0,2,0.896,2,2S41.104,30,40,30z M40,19H16c-1.104,0-2-0.896-2-2s0.896-2,2-2h24c1.104,0,2,0.896,2,2S41.104,19,40,19z"
						></path>
					</g></svg
				>
			</summary>

			<ul class="w-1/2 mr-8 dropdown-content z-[1] rounded shadow-lg border">
				<li>
					<a href="/home" class="grid grid-cols-4 bg-gray-200 p-2"
						><img class="w-8 h-8" src="/btn_home2.png" alt="home" />
						<div class="col-span-3 p-1">Home</div></a
					>
				</li>
				<li>
					<a href="/siram" class="grid grid-cols-4 bg-white p-2"
						><img class="w-8 h-8" src="/penyiraman.png" alt="siram" />
						<div class="col-span-3 p-1">Siram</div></a
					>
				</li>
				<li>
					<a href="/pestisida" class="grid grid-cols-4 bg-gray-200 p-2"
						><img class="w-8 h-8" src="/pestisida.png" alt="pest" />
						<div class="col-span-3 p-1">Pestisida</div></a
					>
				</li>
				<li>
					<a href="/biopest" class="grid grid-cols-4 bg-white p-2"
						><img class="w-8 h-8" src="/biopestisida.png" alt="biopest" />
						<div class="col-span-3 p-1">Biopestisida</div></a
					>
				</li>
				<li>
					<a href="/setup" class="grid grid-cols-4 bg-gray-200 p-2"
						><img class="w-8 h-8" src="/setup.png" alt="home" />
						<div class="col-span-3 p-1">Setup</div></a
					>
				</li>
				<li>
					<a href="/" class="grid grid-cols-4 bg-white p-2"
						><svg
							fill="#000000"
							class="w-6 h-6"
							version="1.1"
							id="Layer_1"
							xmlns="http://www.w3.org/2000/svg"
							xmlns:xlink="http://www.w3.org/1999/xlink"
							viewBox="0 0 512 512"
							enable-background="new 0 0 512 512"
							xml:space="preserve"
							><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
								id="SVGRepo_tracerCarrier"
								stroke-linecap="round"
								stroke-linejoin="round"
							></g><g id="SVGRepo_iconCarrier">
								<path
									d="M469.3,469.3H42.7V42.7H256L298.7,0h-256C19.1,0,0,19.1,0,42.7v426.7C0,492.9,19.1,512,42.7,512h426.7 c23.6,0,42.7-19.1,42.7-42.7V320l-42.7,42.7V469.3z M85.3,426.7C149.1,255.7,234.7,256,362.7,256v85.3L512,192L362.7,42.7V128 C85.3,128,85.1,341.1,85.3,426.7z"
								></path>
							</g></svg
						>
						<div class="col-span-3 p-1">Keluar</div></a
					>
				</li>
			</ul>
		</details>
	</div>
</div>

<Modal bind:showModal bind:timeOut>
	{#if showMode === 3}<!--mode alert-->
		<!-- alert-->
		<h3 class="text-xl font-bold text-center text-red-500">!!! Perhatian !!!</h3>
		<hr />
		{#if alertType === 0}
			{#if $runMode === 1}
				<div>Sedang Penyiraman</div>
			{:else if $runMode === 2}
				<div>Sedang Penyemprotan Pestisida</div>
			{:else if $runMode === 3}
				<div>Sedang Penyemproten Biopest</div>
			{/if}
		{:else if alertType === 1}
			<div class="text-center w-full">Fungsi ini tidak berjalan di mode Demo</div>
		{:else if alertType === 2}<!--koneksi-->
			<div class="text-center w-full">Sedang Offline</div>
		{:else if alertType === 3}<!--lahan-->
			<div class="text-center w-full">Pilih Lahan</div>
		{:else if alertType === 4}<!--Hari-->
			<div class="text-center w-full">Pilih Hari</div>
		{/if}
	{/if}
</Modal>

<style>
	.mainbg {
		background-image: url('/bg_home.png');
		background-position: center;
		background-size: cover;
	}
	.hd_home {
		background-image: url('/hd_home.png');
		background-position: center;
		background-size: cover;
	}
</style>
