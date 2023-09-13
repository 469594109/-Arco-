import Mock from 'mockjs';
import setupMock, {
  successResponseWrap,
  failResponseWrap,
} from '@/utils/setup-mock';

import { MockParams } from '@/types/mock';
import { isLogin } from '@/utils/auth';

setupMock({
  setup() {
    // Mock.XHR.prototype.withCredentials = true;

    // 用户信息
    Mock.mock(new RegExp('/api/user/info'), () => {
      if (isLogin()) {
        const role = window.localStorage.getItem('userRole') || 'admin';
        return successResponseWrap({
          name: '王立群',
          avatar:
            '//lf1-xgcdn-tos.pstatp.com/obj/vcloud/vadmin/start.8e0e4855ee346a46ccff8ff3e24db27b.png',
          email: 'wangliqun@email.com',
          job: 'frontend',
          jobName: '前端艺术家',
          organization: 'Frontend',
          organizationName: '前端',
          location: 'beijing',
          locationName: '北京',
          introduction: '人潇洒，性温存',
          personalWebsite: 'https://www.arco.design',
          phone: '150****0000',
          registrationDate: '2013-05-10 12:10:00',
          accountId: '15012312300',
          certification: 1,
          role,
        });
      }
      return failResponseWrap(null, '未登录', 50008);
    });

    // 登录
    Mock.mock(new RegExp('login/login_login'), (params: MockParams|any) => {
        const data = {
            accountId:params?.body.get('accountId'), 
            password:params?.body.get('password')
        }
        const { accountId, password } = data;
        if (!accountId) {
            return failResponseWrap(null, '用户名不能为空', 50000);
        }
        if (!password) {
            return failResponseWrap(null, '密码不能为空', 50000);
        }
        if (accountId === 'YWRtaW5AdGVzdA==' && password === 'YWRtaW5AdGVzdDAzMjU=') {
            window.localStorage.setItem('userRole', 'admin');
            return successResponseWrap({"success":true,"message":"登录成功"});
        }
        return failResponseWrap(null, '账号或者密码错误', 50000);
    });

    // 登出
    Mock.mock(new RegExp('login/logout'), () => {
      return successResponseWrap(null);
    });

    // 用户的服务端菜单
    Mock.mock(new RegExp('systemManage/main/showSubMenuForBdis'), () => {
      const menuList = {"success":true,"message":{"accountName":"系统管理员","menuVOList":[{"menu_id":20511,"menu_name":"一键搜","menu_parent":-1,"menu_url":"oneSearch","menu_rank":"1","menu_desc":"一键搜页面","is_valid":"1","is_leaf":"1","is_checked":null,"is_checked_boolean":false,"icon_name":"icon-search","big_icon_name":"","is_show_dialog":"1","dep_id":null,"role_id":null,"enable":"0","development_people":null,"development_state":null,"development_start":null,"development_end":null,"development_day":null,"development_fun_not_num":null,"development_fun_on_num":null,"development_fun_finish_num":null,"development_fun_num":null,"development_task_not_num":null,"development_task_on_num":null,"development_task_finish_num":null,"development_task_num":null,"children":[]},{"menu_id":20512,"menu_name":"采集账号","menu_parent":-1,"menu_url":"collectionAccount","menu_rank":"2","menu_desc":"采集账号","is_valid":"1","is_leaf":"1","is_checked":null,"is_checked_boolean":false,"icon_name":"icon-robot","big_icon_name":"","is_show_dialog":"1","dep_id":null,"role_id":null,"enable":"0","development_people":null,"development_state":null,"development_start":null,"development_end":null,"development_day":null,"development_fun_not_num":null,"development_fun_on_num":null,"development_fun_finish_num":null,"development_fun_num":null,"development_task_not_num":null,"development_task_on_num":null,"development_task_finish_num":null,"development_task_num":null,"children":[]},{"menu_id":20273,"menu_name":"系统管理","menu_parent":-1,"menu_url":"systemManage","menu_rank":"10","menu_desc":"","is_valid":"1","is_leaf":"0","is_checked":null,"is_checked_boolean":false,"icon_name":"icon-settings","big_icon_name":"14","is_show_dialog":"1","dep_id":null,"role_id":null,"enable":"0","development_people":null,"development_state":null,"development_start":null,"development_end":null,"development_day":null,"development_fun_not_num":null,"development_fun_on_num":null,"development_fun_finish_num":null,"development_fun_num":null,"development_task_not_num":null,"development_task_on_num":null,"development_task_finish_num":null,"development_task_num":null,"children":[{"menu_id":20266,"menu_name":"账号管理","menu_parent":20273,"menu_url":"account","menu_rank":"1","menu_desc":"","is_valid":"1","is_leaf":"1","is_checked":null,"is_checked_boolean":false,"icon_name":"","big_icon_name":"12","is_show_dialog":"1","dep_id":null,"role_id":null,"enable":"0","development_people":null,"development_state":null,"development_start":null,"development_end":null,"development_day":null,"development_fun_not_num":null,"development_fun_on_num":null,"development_fun_finish_num":null,"development_fun_num":null,"development_task_not_num":null,"development_task_on_num":null,"development_task_finish_num":null,"development_task_num":null,"children":[]},{"menu_id":20267,"menu_name":"角色管理","menu_parent":20273,"menu_url":"role","menu_rank":"2","menu_desc":"","is_valid":"1","is_leaf":"1","is_checked":null,"is_checked_boolean":false,"icon_name":"","big_icon_name":"16","is_show_dialog":"1","dep_id":null,"role_id":null,"enable":"0","development_people":null,"development_state":null,"development_start":null,"development_end":null,"development_day":null,"development_fun_not_num":null,"development_fun_on_num":null,"development_fun_finish_num":null,"development_fun_num":null,"development_task_not_num":null,"development_task_on_num":null,"development_task_finish_num":null,"development_task_num":null,"children":[]},{"menu_id":20269,"menu_name":"部门管理","menu_parent":20273,"menu_url":"department","menu_rank":"4","menu_desc":"","is_valid":"1","is_leaf":"1","is_checked":null,"is_checked_boolean":false,"icon_name":"","big_icon_name":"13","is_show_dialog":"1","dep_id":null,"role_id":null,"enable":"0","development_people":null,"development_state":null,"development_start":null,"development_end":null,"development_day":null,"development_fun_not_num":null,"development_fun_on_num":null,"development_fun_finish_num":null,"development_fun_num":null,"development_task_not_num":null,"development_task_on_num":null,"development_task_finish_num":null,"development_task_num":null,"children":[]},{"menu_id":20270,"menu_name":"菜单管理","menu_parent":20273,"menu_url":"menu","menu_rank":"5","menu_desc":"","is_valid":"1","is_leaf":"1","is_checked":null,"is_checked_boolean":false,"icon_name":"","big_icon_name":"17","is_show_dialog":"1","dep_id":null,"role_id":null,"enable":"0","development_people":null,"development_state":null,"development_start":null,"development_end":null,"development_day":null,"development_fun_not_num":null,"development_fun_on_num":null,"development_fun_finish_num":null,"development_fun_num":null,"development_task_not_num":null,"development_task_on_num":null,"development_task_finish_num":null,"development_task_num":null,"children":[]},{"menu_id":20346,"menu_name":"系统参数","menu_parent":20273,"menu_url":"systemParamAction","menu_rank":"12","menu_desc":"","is_valid":"1","is_leaf":"1","is_checked":null,"is_checked_boolean":false,"icon_name":"","big_icon_name":"18","is_show_dialog":"1","dep_id":null,"role_id":null,"enable":"0","development_people":null,"development_state":null,"development_start":null,"development_end":null,"development_day":null,"development_fun_not_num":null,"development_fun_on_num":null,"development_fun_finish_num":null,"development_fun_num":null,"development_task_not_num":null,"development_task_on_num":null,"development_task_finish_num":null,"development_task_num":null,"children":[]},{"menu_id":20513,"menu_name":"菜单管理1","menu_parent":20273,"menu_url":"menuAdmin","menu_rank":"99","menu_desc":"","is_valid":"1","is_leaf":"1","is_checked":null,"is_checked_boolean":false,"icon_name":null,"big_icon_name":"","is_show_dialog":"1","dep_id":null,"role_id":null,"enable":"0","development_people":null,"development_state":null,"development_start":null,"development_end":null,"development_day":null,"development_fun_not_num":null,"development_fun_on_num":null,"development_fun_finish_num":null,"development_fun_num":null,"development_task_not_num":null,"development_task_on_num":null,"development_task_finish_num":null,"development_task_num":null,"children":[]}]}]}};
      return successResponseWrap(menuList);
    });
  },
});
