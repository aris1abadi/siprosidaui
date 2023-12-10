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
  lahan4Pestisida_status
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





const kontrolId = "2002"

const subMqtt = "bsip-out/" + kontrolId + "/#"
const pubMqtt = "bsip-in/" + kontrolId + "/"
const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)
//const host = 'ws://abadinet.my.id:2020'
const host = 'wss://node-red.balingtansmart.my.id/ws'



const options = {
  keepalive: 30,
  clientId,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
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

client.on('connect', () => {
  console.log('client connected:' + clientId)
  client.subscribe(subMqtt, { qos: 0 })
  let pubStatus = pubMqtt + "kontrol/0/status"
  client.publish(pubStatus, 'siprosida ui 2003 reconect', { qos: 0, retain: false })
})

client.on('message', (topic, message, packet) => {
  console.log('Received Message:= ' + message.toString() + '\nOn topic:= ' + topic)
  const topicMqtt = topic.split('/');
  //console.log("type msg: " + topicMqtt[2] + "-" + topicMqtt[4] + " => " + message)
  //bsip-in/2002/kontrol/0/cmd
  if (topicMqtt[2] === "lengas") {
    if (topicMqtt[4] == "value") {
      //console.log("lengas " + topicMqtt[3] + ":" + message)
      if (topicMqtt[3] === '1') {
        lengas1.set(String(message))
        //$lengas1 = String(message)      
      } else if (topicMqtt[3] === '2') {
        lengas2.set(String(message))
      } else if (topicMqtt[3] === '3') {
        lengas3.set(String(message))
      } else if (topicMqtt[3] === '4') {
        lengas4.set(String(message))
      }
    }
  } else if (topicMqtt[2] === "sensorDHT") {
    if (topicMqtt[4] === "temp") {
      suhuUdara.set(String(message))
    } else if (topicMqtt[4] === "hum") {
      kelembabanUdara.set(String(message))
    }

  } else if (topicMqtt[2] === "sensorFlow") {
    if (topicMqtt[4] === "volumeRate") {
      volumeAir.set(String(message))
    }

  }else if (topicMqtt[2] === "siram") {
    if (topicMqtt[4] === "status") {
      switch (topicMqtt[3]) {
        case '0':
          if (String(message) === '1') {
            siram_status.set(true)
          } else {
            siram_status.set(false)
          }
          break;
        case '1':
          if (String(message) === '1') {
            lahan1_status.set(true)
          } else {
            lahan1_status.set(false)
          }
          break;

        case '2':
          if (String(message) === '1') {
            lahan2_status.set(true)
          } else {
            lahan2_status.set(false)
          }
          break;

        case '3':
          if (String(message) === '1') {
            lahan3_status.set(true)
          } else {
            lahan3_status.set(false)
          }
          break;

        case '4':
          if (String(message) === '1') {
            lahan4_status.set(true)
          } else {
            lahan4_status.set(false)
          }
          break;
      }
    } else if (topicMqtt[4] === "getAmbang") {

    }

  } else if (topicMqtt[2] === "pestisida") {
    if (topicMqtt[4] === "status") {
      switch (topicMqtt[3]) {
        case '0':
          if (String(message) === '1') {
            pestisida_status.set(true)
          } else {
            pestisida_status.set(false)
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
    }else if(topicMqtt[4] === "lahanStatus"){
      
    }

  } else if (topicMqtt[2] === "biopest") {

  }




})

client.on('close', () => {
  console.log(clientId + ' disconnected')
})

export function kirimMsg(type, num, cmd, msg) {
  let ms = pubMqtt + type + '/' + num + '/' + cmd
  client.publish(ms, msg)
}

