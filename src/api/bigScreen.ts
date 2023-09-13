import axios from 'axios';

export function chinaMap() {
    const api = 'accountAnalyze/mapStatistics'
    return axios.get(`${api}`);
}

export function hotspotList(time?:string) {
    const api = 'hotspot/list'
    return axios.get(`${api}?time=${time||''}`);
}

export function fileStatistics() {
    const api = '/accountAnalyze/getFileStatistics'
    return axios.get(`${api}`);
}

export function getKeyWord() {
    const api = `core/groupInfo/wordCloud`;
    return axios.get(api);
}

export function getColRecord() {
    const api = `accountAnalyze/getColRecord`;
    return axios.get(api);
}

export function statistics() {
    const api = `accountAnalyze/statistics`;
    return axios.get(api);
}