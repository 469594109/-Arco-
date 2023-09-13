import dayjs from 'dayjs';
import router from '@/router';
import { Message } from '@arco-design/web-vue';


// console.log(router);

/* 跳转到分析页  需传入ID和哪个分析页  成员分析传入 member  群分析无需传入 */
export function toAnalyses(data: any,type = '') {
    // console.log(data);
    const id = data && data.replace(/[</?em>]/g,'');
    const openData = {
        path: '/oneSearchAnalyses/',
        query: {},
    };
    if (!id) {
        Message && Message.error({
            id: 'no page',
            content: '系统错误，请联系管理员！',
        })
        return false;
    }
    if(type === 'member') {
        openData.path += 'accAnalyses';
        openData.query = {
            id,
            group: false,
            // groupId: data?.group_id || '',
        }
    } else {
        openData.path += 'groupAnalyses';
        openData.query = {
            id,
            group: true,
        }
    }
    const url = router.resolve(openData);
    window.open(url.href);
    return false;
}

/* 跳转到新的一键搜页面 需要什么参数自定义 id必须 */
export function toOneSearchInfo(data: any,type = '',extra={}) {
    const id = data && data.replace(/[</?em>]/g,'');
    const openData = {
        path: '/newOneSearch/',
        query: {},
    };
    if (!id) {
        Message && Message.error({
            id: 'no page',
            content: '系统错误，请联系管理员！',
        })
        return false;
    }
    if(type === 'user') {
        openData.path += 'userInfo';
    } else {
        openData.path += 'groupInfo';
    }
    openData.query = {
        id,
        ...extra
    }
    const url = router.resolve(openData);
    window.open(url.href);
    return false;
}

export function datePickerBtn () {
    return [
        {
            label: '此刻',
            value: () => dayjs().format(),
        },
        {
            label: '1月后',
            value: () => dayjs().add(1, 'month'),
        },
        {
            label: '3月后',
            value: () => dayjs().add(3, 'month'),
        },
        {
            label: '1年后',
            value: () => dayjs().add(1, 'year'),
        },
    ]
}