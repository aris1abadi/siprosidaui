import mqtt from 'mqtt'; // import namespace "mqtt"


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
export let lengas1Val = 0
export let lengas2Val = 0
export let lengas3Val = 0
export let lengas4Val = 0

const kontrolId ="2002"

const subMqtt = "bsip-out/" + kontrolId + "/#"
const pubMqtt = "bsip-in/" + kontrolId + "/"
const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)
const host = 'ws://abadinet.my.id:2020'

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
  client.publish(pubStatus, 'kontrol 2003 reconect', { qos: 0, retain: false })
})

client.on('message', (topic, message, packet) => {
  //console.log('Received Message:= ' + message.toString() + '\nOn topic:= ' + topic)
  const topicMqtt = topic.split('/');
  //console.log("type msg: " + topicMqtt[2])
  //bsip-in/2002/kontrol/0/cmd
  if((topicMqtt[2] === "lengas") && (topicMqtt[4] == "value")){
    console.log("lengas " + topicMqtt[3] +":" + message)
    switch(topicMqtt[3]){
      
      case "1":
        lengas1Val = parseInt(String(message))
      break;
      case "2":
        lengas2Val = parseInt(String(message))
      break;
      case "3":
        lengas3Val = parseInt(String(message))
      break;
      case "4":
        lengas4Val = parseInt(String(message))
      break;
    }
  }
      

  
 
})

client.on('close', () => {
  console.log(clientId + ' disconnected')
})

export function kirimMsg(type,num,cmd,msg){
	let ms = pubMqtt + type + '/' + num + '/' + cmd
	client.publish(ms,msg)
}

