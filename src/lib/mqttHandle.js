import mqtt from 'mqtt'; // import namespace "mqtt"
import {
  lengas1,
  lengas2,
  lengas3,
  lengas4,
  suhuUdara,
  kelembabanUdara,
  lahan1_status,
  lahan2_status,
  lahan3_status,
  lahan4_status,
  useLengas,
  siram_status,
  volumeAir,
  ambangLengas,
  pestisida_status,
  lahan1Pestisida_status,
  lahan2Pestisida_status,
  lahan3Pestisida_status,
  lahan4Pestisida_status,
  lahan1Biopest_status,
  lahan2Biopest_status,
  lahan3Biopest_status,
  lahan4Biopest_status,
  jadwalSiram,
  newJadwalSiram,
  jadwalPestisida,
  newJadwalPestisida,
  durasiManual,
  mqttStatus,
  runMode,
  resetAllValue,
  biopest_status
} from './store/stores';



import { onMount } from 'svelte';

//const mqtt = require('mqtt')

/***
 * Browser
 * This document explains how to use MQTT over WebSocket with the ws and wss protocols.
 * EMQX's default port for ws connection is 8083 and for wss connection is 8084.
 * Note that you need to add a path after the connection address, such as /mqtt.
 */
//const url = 'ws://abadinet.my.id:2020/mqtt';
/***
 * Node.js
 * This document explains how to use MQTT over TCP with both mqtt and mqtts protocols.
 * EMQX's default port for mqtt connections is 1883, while for mqtts it is 8883.
 */

const kontrolId = "2004"

const subMqtt = "bsip-out/" + kontrolId + "/#"
const pubMqtt = "bsip-in/" + kontrolId + "/"
const clientId = 'siprosida_' + Math.random().toString(16).substr(2, 8)
//const host = 'ws://abadinet.my.id:2020'
const host = 'wss://node-red.balingtansmart.my.id/ws'

const options = {
  keepalive: 30,
  clientId,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 5000,
  connectTimeout: 30 * 1000,
  will: {
    topic: 'WillMsg',
    payload: 'Connection Closed abnormally..!',
    qos: 0,
    retain: false
  },
  rejectUnauthorized: false
}

console.log('connecting mqtt client')
const client = mqtt.connect(host, options)

client.on('error', (err) => {
  console.log(err)
  client.end()
})
client.on('disconnect',() =>{
  mqttStatus.set(0);
  console.log('client disconect')
})

client.on('connect', () => {
  console.log('client connected:' + clientId)
  mqttStatus.set(1);
  client.subscribe(subMqtt, { qos: 0 })
  let pubStatus = pubMqtt + "kontrol/0/status"
  client.publish(pubStatus, 'siprosida ui 2003 reconect', { qos: 0, retain: false })
  kirimMsg("kontrol",0,"getAllStatus","1")
})

client.on('message', (topic, message, packet) => {
  //console.log('Received Message:= ' + message.toString() + '\nOn topic:= ' + topic)
  const topicMqtt = topic.split('/');
  //console.log("type msg: " + topicMqtt[2] + "-" + topicMqtt[4] + " => " + message)
  //bsip-in/2002/kontrol/0/cmd
  if (topicMqtt[2] === "lengas") {
    if (topicMqtt[4] == "value") {
      //console.log("lengas " + topicMqtt[3] + ":" + message)
      if (topicMqtt[3] === '1') {
        lengas1.set(parseInt(String(message)))
        //$lengas1 = String(message)      
      } else if (topicMqtt[3] === '2') {
        lengas2.set(parseInt(String(message)))
      } else if (topicMqtt[3] === '3') {
        lengas3.set(parseInt(String(message)))
      } else if (topicMqtt[3] === '4') {
        lengas4.set(parseInt(String(message)))
      }
    }
  } else if (topicMqtt[2] === "sensorDHT") {
    if (topicMqtt[4] === "temp") {
      suhuUdara.set(parseInt(String(message)))
    } else if (topicMqtt[4] === "hum") {
      kelembabanUdara.set(parseInt(String(message)))
    }

  } else if (topicMqtt[2] === "sensorFlow") {
    if (topicMqtt[4] === "volumeRate") {
      volumeAir.set(parseInt(String(message)))
    }

  }else if (topicMqtt[2] === "siram") {
    if (topicMqtt[4] === "status") {
      switch (String(topicMqtt[3])) {
        case '0':
          if (String(message) === '1') {
            siram_status.set(true)
            lahan1_status.set(true)
            lahan2_status.set(true)
            lahan3_status.set(true)
            lahan4_status.set(true)
          } else {
            siram_status.set(false)
            lahan1_status.set(false)
            lahan2_status.set(false)
            lahan3_status.set(false)
            lahan4_status.set(false)
          }
          break;
        case '1':
          if (String(message) === '1') {
            lahan1_status.set(true)
            siram_status.set(true)
          } else {
            lahan1_status.set(false)
          }
          break;

        case '2':
          if (String(message) === '1') {
            lahan2_status.set(true)
            siram_status.set(true)
          } else {
            lahan2_status.set(false)
          }
          break;

        case '3':
          if (String(message) === '1') {
            lahan3_status.set(true)
            siram_status.set(true)
          } else {
            lahan3_status.set(false)
          }
          break;

        case '4':
          if (String(message) === '1') {
            lahan4_status.set(true)
            siram_status.set(true)
          } else {
            lahan4_status.set(false)
          }
          break;
      }
    } else if (topicMqtt[4] === "infoAmbang") {      
      ambangLengas.set(parseInt(String(message)))
    }else if (topicMqtt[4] === "useLengas") {
      if(String(message) === '1'){
        useLengas.set(true);
      }else{
        useLengas.set(false);
      }
    }else if(topicMqtt[4] === "jadwalSiram") {
      jadwalSiram.set(String(message))
      newJadwalSiram.set(true);
    }else if(topicMqtt[4] === "durasiSiram"){
      durasiManual.set(parseInt(String(message)))
    }else if(topicMqtt[4] === "siramStatus"){
      let sts = (String(message)).split(',');
      if(sts[0] === '1'){
        siram_status.set(true);
      }else{
        siram_status.set(false);
        runMode.set(0)
      }
      if(sts[1] === "1"){
        lahan1_status.set(true)
      }else{
        lahan1_status.set(false)
      }

      if(sts[2] === "1"){
        lahan2_status.set(true)
      }else{
        lahan2_status.set(false)
      }

      if(sts[3] === "1"){
        lahan3_status.set(true)
      }else{
        lahan3_status.set(false)
      }

      if(sts[4] === "1"){
        lahan4_status.set(true)
      }else{
        lahan4_status.set(false)
      }

    }

  } else if (topicMqtt[2] === "pestisida") {
    if (topicMqtt[4] === "status") {
      switch (topicMqtt[3]) {
        case '0':
          if (String(message) === '1') {
            pestisida_status.set(true)
            lahan1Pestisida_status.set(true)
            lahan2Pestisida_status.set(true)
            lahan3Pestisida_status.set(true)
            lahan4Pestisida_status.set(true)
          } else {
            pestisida_status.set(false)
            lahan1Pestisida_status.set(false)
            lahan2Pestisida_status.set(false)
            lahan3Pestisida_status.set(false)
            lahan4Pestisida_status.set(false)
          }
          break;
        case '1':
          if (String(message) === '1') {
            lahan1Pestisida_status.set(true)
          } else {
            lahan1Pestisida_status.set(false)
          }
          break;

        case '2':
          if (String(message) === '1') {
            lahan2Pestisida_status.set(true)
          } else {
            lahan2Pestisida_status.set(false)
          }
          break;

        case '3':
          if (String(message) === '1') {
            lahan3Pestisida_status.set(true)
          } else {
            lahan3Pestisida_status.set(false)
          }
          break;

        case '4':
          if (String(message) === '1') {
            lahan4Pestisida_status.set(true)
          } else {
            lahan4Pestisida_status.set(false)
          }
          break;
      }
    }else if(topicMqtt[4] === "jadwalPestisida"){
      jadwalPestisida.set(String(message))
      newJadwalPestisida.set(true)
    }else if(topicMqtt[4] === "pestisidaStatus"){
      let sts = (String(message)).split(',');
      if(sts[0] === '1'){
        pestisida_status.set(true);
      }else{
        pestisida_status.set(false);
        runMode.set(0)
      }
      if(sts[1] === "1"){
        lahan1Pestisida_status.set(true)
      }else{
        lahan1Pestisida_status.set(false)
      }

      if(sts[2] === "1"){
        lahan2Pestisida_status.set(true)
      }else{
        lahan2Pestisida_status.set(false)
      }

      if(sts[3] === "1"){
        lahan3Pestisida_status.set(true)
      }else{
        lahan3Pestisida_status.set(false)
      }

      if(sts[4] === "1"){
        lahan4Pestisida_status.set(true)
      }else{
        lahan4Pestisida_status.set(false)
      }

    }

  } else if (topicMqtt[2] === "biopest") {

  }else if(topicMqtt[2] === "kontrol"){
    if(topicMqtt[4] === "allStatus"){
      let sts = (String(message)).split(',');   
      console.log("all status load")
      runMode.set(parseInt(sts[0]))
      switch(parseInt(sts[0])){
        case 0:
          //mode stanby reset semua status selenoid
          resetAllValue()
        break;
        case 1:
          //mode siram berjalan
          siram_status.set(true)
          if(sts[1] === '1'){//selenoid siram 1
            lahan1_status.set(true)
          }else{
            lahan1_status.set(false)
          }

          if(sts[2] === '1'){//selenoid siram 1
            lahan2_status.set(true)
          }else{
            lahan2_status.set(false)
          }

          if(sts[3] === '1'){//selenoid siram 1
            lahan3_status.set(true)
          }else{
            lahan3_status.set(false)
          }

          if(sts[4] === '1'){//selenoid siram 1
            lahan4_status.set(true)
          }else{
            lahan4_status.set(false)
          }
        break;
        case 2:
          pestisida_status.set(true)
          if(sts[1] === '1'){//selenoid pestisida 1
            lahan1Pestisida_status.set(true)
          }else{
            lahan1Pestisida_status.set(false)
          }

          if(sts[2] === '1'){//selenoid pestisida 1
            lahan2Pestisida_status.set(true)
          }else{
            lahan2Pestisida_status.set(false)
          }

          if(sts[3] === '1'){//selenoid pestisida 1
            lahan3Pestisida_status.set(true)
          }else{
            lahan3Pestisida_status.set(false)
          }

          if(sts[4] === '1'){//selenoid pestisida 1
            lahan4Pestisida_status.set(true)
          }else{
            lahan4Pestisida_status.set(false)
          }
        break;

        case 3:
          biopest_status.set(true)
          if(sts[1] === '1'){//selenoid pestisida 1
            lahan1Biopest_status.set(true)
          }else{
            lahan1Biopest_status.set(false)
          }

          if(sts[2] === '1'){//selenoid pestisida 1
            lahan2Biopest_status.set(true)
          }else{
            lahan2Biopest_status.set(false)
          }

          if(sts[3] === '1'){//selenoid pestisida 1
            lahan3Biopest_status.set(true)
          }else{
            lahan3Biopest_status.set(false)
          }

          if(sts[4] === '1'){//selenoid pestisida 1
            lahan4Biopest_status.set(true)
          }else{
            lahan4Biopest_status.set(false)
          }
        break;
      }
      
    }
  }
})

client.on('close', () => {
  console.log(clientId + ' disconnected')
})

export function kirimMsg(type, num, cmd, msg) {
  let ms = pubMqtt + type + '/' + num + '/' + cmd
  client.publish(ms, msg, { qos: 0, retain: false })
}

