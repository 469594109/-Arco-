import localeMessageBox from '@/components/message-box/locale/en-US';
import localeLogin from '@/views/login/locale/en-US';

import localTablePage from '@/components/table/locale/en-US';// 搜索表格数据组件

import localeSettings from './en-US/settings';

export default {
    'navbar.systemName': 'Yun Qing system',
    'menu.groupMenu': 'home',
    'menu.groupMenu.systemSettings': 'System settings',
    'menu.groupMenu.menu.groupMenu.accountManage': 'AccountManage',
    'menu.groupMenu.menu.groupMenu.roleManage': 'RoleManage',
    'menu.groupMenu.menuAdmin': 'Menu management',
    'menu.groupMenu.systemParam': 'system parameter',
    ...localeSettings,
    ...localeMessageBox,
    ...localeLogin,
    ...localTablePage,
};
