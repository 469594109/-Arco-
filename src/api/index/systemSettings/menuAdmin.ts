import axios from 'axios';
// import { getUrlChange } from './library';

export interface submit {
    menu_id: string | undefined,
    menu_name: string,
    menu_url: string,
    menu_rank: string | undefined,
    menu_desc: string | undefined,
    menu_parent: string,
    is_valid: number | string,
    is_show_dialog: number | string,
    is_leaf: number | string,
    big_icon_name: string | undefined,
}

/* 获取所有菜单 */
export function geAllMenuTree() {
    const url = 'systemManage/menu/getAllMenusTree';
    return axios.post(url);
}

/* 编辑菜单 */
export function submitEditMenu(type:boolean,data:submit) {
    const add = 'systemManage/menu/addMenu';
    const edit = 'systemManage/menu/updateMenu';
    return axios.post(type ? edit : add, data);
}

/* 删除菜单 */
export function delMenu(id:string) {
    const url = 'systemManage/menu/delMenu';
    return axios.post(url, {menu_id:id});
}
