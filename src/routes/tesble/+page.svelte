<script>
	'use strict';
	const bleNusServiceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
	const bleNusCharRXUUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
	const bleNusCharTXUUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
	const MTU = 20;

	var bleDevice;
	var bleServer;
	var nusService;
	var rxCharacteristic;
	var txCharacteristic;
	let sendCount = 0;

	var connected = false;
	let logDisplay = 'log console\n';

	function connectionToggle() {
		if (connected) {
			disconnect();
		} else {
			connect();
		}
	}

	async function connect() {
		
		if (!navigator.bluetooth) {
			logDisplay += 'WebBluetooth API is not available.\r\n';
			return;
		}
		logDisplay += 'Requesting Bluetooth Device...\n';
		navigator.bluetooth
			.requestDevice({
				//filters: [{services: []}]
				optionalServices: [bleNusServiceUUID],
				acceptAllDevices: true
			})
			.then((device) => {
				bleDevice = device;
				logDisplay += 'Found ' + device.name;
				logDisplay += 'Connecting to GATT Server...\n';
				bleDevice.addEventListener('gattserverdisconnected', onDisconnected);
				return device.gatt.connect();
			})
			.then((server) => {
				logDisplay += 'Locate NUS service\n';
				return server.getPrimaryService(bleNusServiceUUID);
			})
			.then((service) => {
				nusService = service;
				logDisplay += 'Found NUS service: ' + service.uuid;
			})
			.then(() => {
				logDisplay += 'Locate RX characteristic\n';
				return nusService.getCharacteristic(bleNusCharRXUUID);
			})
			.then((characteristic) => {
				rxCharacteristic = characteristic;
				logDisplay += 'Found RX characteristic\n';
			})
			.then(() => {
				logDisplay += 'Locate TX characteristic\n';
				return nusService.getCharacteristic(bleNusCharTXUUID);
			})
			.then((characteristic) => {
				txCharacteristic = characteristic;
				logDisplay += 'Found TX characteristic\n';
			})
			.then(() => {
				logDisplay += 'Enable notifications\n';
				return txCharacteristic.startNotifications();
			})
			.then(() => {
				logDisplay += 'Notifications started\n';
				txCharacteristic.addEventListener('characteristicvaluechanged', handleNotifications);
				connected = true;
				////window.term_.io.println('\r\n' + bleDevice.name + ' Connected.\n'
				nusSendString('\r\n');
				//setConnButtonState(true);
			})
			.catch((error) => {
				logDisplay += error;
				//window.term_.io.println('' + error);
				if (bleDevice && bleDevice.gatt.connected) {
					bleDevice.gatt.disconnect();
				}
			});
	}

	function disconnect() {
		if (!bleDevice) {
			logDisplay += 'No Bluetooth Device connected...\n';
			return;
		}
		logDisplay += 'Disconnecting from Bluetooth Device...\n';
		if (bleDevice.gatt.connected) {
			bleDevice.gatt.disconnect();
			connected = false;
			//setConnButtonState(false);
			logDisplay += 'Bluetooth Device connected: ' + bleDevice.gatt.connected;
		} else {
			logDisplay += '> Bluetooth Device is already disconnected\n';
		}
	}

	function onDisconnected() {
		connected = false;
		logDisplay += '\r\n' + bleDevice.name + ' Disconnected.';
	}

	function handleNotifications(event) {
		logDisplay += 'notification';
		let value = event.target.value;
		// Convert raw data bytes to character values and use these to
		// construct a string.
		let str = '';
		for (let i = 0; i < value.byteLength; i++) {
			str += String.fromCharCode(value.getUint8(i));
		}
		logDisplay += str;
	}

	function nusSendString(s) {
		if (bleDevice && bleDevice.gatt.connected) {
			logDisplay += 'send: ' + s;
			let val_arr = new Uint8Array(s.length);
			for (let i = 0; i < s.length; i++) {
				let val = s[i].charCodeAt(0);
				val_arr[i] = val;
			}
			sendNextChunk(val_arr);
		} else {
			logDisplay += 'Not connected to a device yet.';
		}
	}

	function sendNextChunk(a) {
		let chunk = a.slice(0, MTU);
		rxCharacteristic.writeValue(chunk).then(function () {
			if (a.length > MTU) {
				sendNextChunk(a.slice(MTU));
			}
		});
	}

	function tes(){
		let st = 'Tes ble ' + sendCount;
		nusSendString(st)
		sendCount++;
	}
</script>

<div>
	<div class="w-full h-full grid justify-items-center P-4">
		<button class="w-1/4 h-8 border mt-8" on:click={() => connect()}>
			{#if connected == true}
				Disconnect
			{:else}
				Connect
			{/if}
		</button>
		<button class="w-1/4 h-8 border border-black mt-8" on:click={() => tes()}>tes</button>
		<div class=" mt-4 w-11/12 h-64 container mx-auto overflow-auto border border-black">
			{logDisplay}
		</div>
	</div>
</div>
