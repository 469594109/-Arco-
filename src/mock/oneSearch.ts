import Mock from 'mockjs';
import setupMock, {
  successResponseWrap,
  failResponseWrap,
} from '@/utils/setup-mock';

import { MockParams } from '@/types/mock';

setupMock({
  setup() {
    // Mock.XHR.prototype.withCredentials = true;

    // 用户信息
    Mock.mock(new RegExp('oneSearch/search'), (params:any) => {
        const data = {
            search:params?.body.get('search'),
            select:params?.body.get('select')
        }
        if (!data.select) {
            return failResponseWrap(null, '条件不能为空', 50000);
        }
        if (!data.search) {
            return failResponseWrap(null, '搜索内容不能为空', 50000);
        }
        if (Number(data.select) - 1) {
            return successResponseWrap({"success":true,"message": [
                {
                    id: '5461323232',
                    member_name: '员工',
                    times: '2023/01/09',
                    phone: '12461323232',
                },
                {
                    id: '5461323232',
                    nick_name: '群名称',
                    content: '天气不错！！！',
                    times: '2023/01/09',
                    count: '3333人'
                },
                {
                    id: '5461323232',
                    nick_name: '群名称',
                    content: '天气不错！！！',
                    member_name: '员工',
                    times: '2023/01/09',
                    phone: '12461323232',
                    count: '3333人'
                },
            ]});
        } 
        return successResponseWrap({"success":true,"message": [
            {
                id: '5461323232',
                nick_name: '群名称',
                content: '天气不错！！！',
                member_name: '员工',
                times: '2023/01/09',
                phone: '12461323232',
                count: '3333人'
            },
            {
                id: '5461323232',
                nick_name: '群名称',
                content: '天气不错！！！',
                member_name: '员工',
                times: '2023/01/09',
                phone: '12461323232',
                count: '3333人'
            },
            {
                id: '5461323232',
                nick_name: '群名称',
                content: '天气不错！！！',
                member_name: '员工',
                times: '2023/01/09',
                phone: '12461323232',
                count: '3333人'
            },
        ]});
        
    });

    // 登录
    Mock.mock(new RegExp('aaa'), (params: MockParams|any) => {
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
  },
});
