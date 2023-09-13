import axios from 'axios';
// import { getUrlChange } from './library';

// export interface params {
// }

const prefix = 'systemManage/account/';
const getAllUrl = `${prefix}getDataGrid`;

export {
    getAllUrl,
}

export function getRoleList() {
    const url = `${prefix}getRoleListForSelect`;
    return axios.post(url);
}

export function addAcc(data:any) {
    const url = `${prefix}addAccout`;
    return axios.post(url, data);
}

export function upDataAcc(data:any) {
    const url = `${prefix}updateAccout`;
    return axios.post(url, data);
}

export function delAcc(data:any) {
    const url = `${prefix}delAccout`;
    return axios.post(url, data);
}
