import { ble_connected } from "./store/stores";
import { cekInputMsg } from "./mqttHandle";
import { get } from "svelte/store";

const bleNusServiceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const bleNusCharRXUUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const bleNusCharTXUUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
const MTU = 20;

let bleDevice;
let bleServer;
let nusService;
let rxCharacteristic;
let txCharacteristic;
let sendCount = 0;


let logDisplay = 'log console\n';

/*
function connectionToggle() {
	if (ble_connected) {
		disconnect();
	} else {
		connect();
	}
}
*/

export function ble_connect(){
	if(get(ble_connected)){
		disconnect();
	}else{
		ble_click();
	}
}
async function ble_click() {

	if (!navigator.bluetooth) {
		
		console.log( 'WebBluetooth API tidak tersedia.\r\n');
		return;
	}
	console.log( 'Requesting Bluetooth Device...\n');
	navigator.bluetooth
		.requestDevice({
			//filters: [{services: []}]
			optionalServices: [bleNusServiceUUID],
			acceptAllDevices: true
		})
		.then((device) => {
			bleDevice = device;
			console.log( 'Found ' + device.name);
			console.log( 'Connecting to GATT Server...\n');
			bleDevice.addEventListener('gattserverdisconnected', onDisconnected);
			return device.gatt.connect();
		})
		.then((server) => {
			console.log( 'Locate NUS service\n');
			return server.getPrimaryService(bleNusServiceUUID);
		})
		.then((service) => {
			nusService = service;
			console.log( 'Found NUS service: ' + service.uuid);
		})
		.then(() => {
			console.log( 'Locate RX characteristic\n');
			return nusService.getCharacteristic(bleNusCharRXUUID);
		})
		.then((characteristic) => {
			rxCharacteristic = characteristic;
			console.log( 'Found RX characteristic\n');
		})
		.then(() => {
			console.log( 'Locate TX characteristic\n');
			return nusService.getCharacteristic(bleNusCharTXUUID);
		})
		.then((characteristic) => {
			txCharacteristic = characteristic;
			console.log( 'Found TX characteristic\n');
		})
		.then(() => {
			console.log( 'Enable notifications\n');
			return txCharacteristic.startNotifications();
		})
		.then(() => {
			console.log( 'Notifications started\n');
			txCharacteristic.addEventListener('characteristicvaluechanged', handleNotifications);
			ble_connected.set(true);
			////window.term_.io.println('\r\n' + bleDevice.name + ' Connected.\n'
			//nusSendString('\r\n');
			//setConnButtonState(true);
		})
		.catch((error) => {
			console.log( error)
			//window.term_.io.println('' + error);
			if (bleDevice && bleDevice.gatt.connected) {
				bleDevice.gatt.disconnect();
			}
		});
}

function disconnect() {
	if (!bleDevice) {
		console.log( 'No Bluetooth Device connected...\n');
		return;
	}
	console.log( 'Disconnecting from Bluetooth Device...\n');
	if (bleDevice.gatt.connected) {
		bleDevice.gatt.disconnect();
		ble_connected.set(false);
		//setConnButtonState(false);
		console.log( 'Bluetooth Device connected: ' + bleDevice.gatt.connected);
	} else {
		console.log( '> Bluetooth Device is already disconnected\n');
	}
}

function onDisconnected() {
	ble_connected.set(false);
	console.log( '\r\n' + bleDevice.name + ' Disconnected.');
}

function handleNotifications(event) {
	console.log( 'notification');
	let value = event.target.value;
	// Convert raw data bytes to character values and use these to
	// construct a string.
	let str = '';
	for (let i = 0; i < value.byteLength; i++) {
		str += String.fromCharCode(value.getUint8(i));
	}
	console.log( str);
	let bleSplit = str.split(';');
	cekInputMsg(bleSplit[0],bleSplit[1])
}

function nusSendString(s) {
	if (bleDevice && bleDevice.gatt.connected) {
		console.log( 'send: ' + s);
		let val_arr = new Uint8Array(s.length);
		for (let i = 0; i < s.length; i++) {
			let val = s[i].charCodeAt(0);
			val_arr[i] = val;
		}
		sendNextChunk(val_arr);
	} else {
		console.log( 'Not connected to a device yet.');
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

function tes() {
	let st = 'Tes ble ' + sendCount;
	nusSendString(st)
	sendCount++;
}

export function kirim_ble(dta){
	nusSendString(dta);
}