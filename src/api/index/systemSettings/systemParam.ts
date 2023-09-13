import axios from 'axios';
// import { getUrlChange } from './library';

export interface params {
    paramClassify: string,
    paramName: string,
    paramKey: string,
    paramValue: string,
}

const prefix = 'system/systemParamAction/';
const getAllUrl = `${prefix}getSystemConfigTypeInfo`;

export {
    getAllUrl,
}

export function addSystem(data:params) {
    const url = `${prefix}addSystemConfigTypeInfo`;
    return axios.post(url, data);
}

export function upDataSystem(data:params) {
    const url = `${prefix}updateSystemConfigTypeInfo`;
    return axios.post(url, data);
}

export function delSystem(data:params) {
    const url = `${prefix}deleteSystemConfigTypeInfo`;
    return axios.post(url, data);
}
