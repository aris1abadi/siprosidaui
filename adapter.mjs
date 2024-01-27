import process from 'node:process'
import AdapterNode from '@sveltejs/adapter-node';
import AdpaterStatic from '@sveltejs/adapter-auto';

export const nodeAdapter = process.env.NODE_ADAPTER === 'false'

//export const adapter = nodeAdapter ? AdapterNode() : AdpaterStatic()
export const adapter = nodeAdapter ? AdpaterStatic() : AdapterNode() 