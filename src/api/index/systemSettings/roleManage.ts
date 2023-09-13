import axios from 'axios';
// import { getUrlChange } from './library';

// export interface params {
// }

const prefix = 'systemManage/role/';
const getAllUrl = `${prefix}getRoleList`;

export {
    getAllUrl,
}

export function getMenuByDep(roleId: string) {
    const url = `systemManage/department/getMenuByDep`;
    return axios.post(url,{roleId});
}

export function addData(data:any) {
    const url = `${prefix}addRoleMenu`;
    return axios.post(url, data);
}

export function upDataData(data:any) {
    const url = `${prefix}modifyRoleMenu`;
    return axios.post(url, data);
}

export function delData(data:any) {
    const url = `${prefix}deleteRole`;
    return axios.post(url, data);
}
