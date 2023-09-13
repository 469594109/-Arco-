import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

export interface LoginData {
  accountId: string;
  password: string;
}

export interface LoginRes {
  token: string;
}
export function login(data: LoginData) {
//   return axios.post<LoginRes>('/yqb/systemManage/main/showSubMenuForBdis', data);

  return axios.post<LoginRes>('login/login_login', data);
}

export function logout() {
  return axios.post<LoginRes>('login/logout');
}

export function getUserInfo() {
  return axios.post<UserState>('/api/user/info');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('systemManage/main/showSubMenuForBdis');
}
