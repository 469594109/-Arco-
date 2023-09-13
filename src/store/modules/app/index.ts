import { defineStore } from 'pinia';
// import { Notification } from '@arco-design/web-vue';
// import type { NotificationReturn } from '@arco-design/web-vue/es/notification/interface';
import type { RouteRecordNormalized } from 'vue-router';
import defaultSettings from '@/config/settings.json';
import { getMenuList } from '@/api/user';
import { AppState } from './types';

const useAppStore = defineStore('app', {
    state: (): AppState => ({ 
        ...defaultSettings,
        
    }),

  getters: {
    appCurrentSetting(state: AppState): AppState {
      return { ...state };
    },
    appDevice(state: AppState) {
      return state.device;
    },
    appAsyncMenus(state: AppState): RouteRecordNormalized[] {
      return state.serverMenu as unknown as RouteRecordNormalized[];
    },
  },

  actions: {
    // Update app settings
    updateSettings(partial: Partial<AppState>) {
      // @ts-ignore-next-line
      this.$patch(partial);
    },

    // Change theme color
    toggleTheme(dark: boolean) {
      if (dark) {
        this.theme = 'dark';
        document.body.setAttribute('arco-theme', 'dark');
      } else {
        this.theme = 'light';
        document.body.removeAttribute('arco-theme');
      }
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    toggleMenu(value: boolean) {
      this.hideMenu = value;
    },
    async fetchServerMenuConfig() {
    //   let notifyInstance: NotificationReturn | null = null;
      try {
        // notifyInstance = Notification.info({
        //   id: 'menuNotice', // Keep the instance id the same
        //   content: '获取菜单中...',
        //   closable: true,
        // });
        // const { data } = await getMenuList();
        const {message} = await getMenuList() as never;

        const { menuVOList } = message;
        const menuList = [
            {
                path: '/index',
                name: 'index',
                meta: {
                    locale: 'menu.groupMenu',
                    requiresAuth: true,
                    order: 1,
                },
            children: [],
            },
        ] as any[];
        // eslint-disable-next-line no-inner-declarations
        function readArrDepth(arr: any[], children: any[]) {
            arr.forEach((v:any, n:number) => {
                children.push({
                    path: v.menu_url,
                    name: v.menu_url,
                    meta: {
                        title: v.menu_name,
                        locale: v.menu_name,
                        requiresAuth: false,
                        icon: v.icon_name || '',
                        order: Number(v.menu_rank), 
                    },
                    children: []
                })
                if (v.is_leaf === "0") readArrDepth(v.children,children[n].children);
                
            })
        }
        readArrDepth(menuVOList,menuList[0].children);
        this.serverMenu = menuList;
        // notifyInstance = Notification.success({
        //   id: 'menuNotice',
        //   content: '获取菜单成功',
        //   closable: true,
        // });
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // notifyInstance = Notification.error({
        //   id: 'menuNotice',
        //   content: '获取菜单失败',
        //   closable: true,
        // });
      }
    },
    clearServerMenu() {
      this.serverMenu = [];
    },
  },
});

export default useAppStore;
