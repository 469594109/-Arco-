<script lang="ts" setup>
import { ref, reactive, watch, computed } from 'vue';
import axios from 'axios';
import { getUrlChange } from '@/api/library';
import emptyContainer from '@/components/empty/index.vue';

const props = defineProps({
    url: {
        type: String,
        default: '',
    }, // 接口名
    params: {
        type: Object,
    },
    showPagination: {
        type: [Number,Boolean],
        default: 1,
    },
    pagination: Object, // 自定义修改分页配置项
    // paramsKey: 请求中data的key名，可能每个人要的参数不一样，故设为自定义
    pKey: { 
        type: Object,
        default:()=>({
            sK: 'pageSize', // sizeKey名
            cK: 'curPageNo', // currentKey名
        })
    },
    // 请求方式
    method: {
        type: String,
        default: 'post',
    },
    // request Key: 请求中完成后，可能每个人返回的参数不一样，故设为自定义
    rKey: { 
        type: Object,
        default:()=>({
            dataK: 'message', // 返回数据的主体键名
            records: 'dataRows', // 主体中列表键名
            total: 'totalRecords', // 列表的总数据量
            page: 'curPageNo', // 当前页码
            size: 'pageSize', // 每页返回量
        })
    },

})
const emit = defineEmits(['setData'])
const pagingData = reactive({
    total: 0,
    current: 1,
    pageSize: 20,
});

let param = {};
const loading = ref(false);
const resetParam = (params?: any)=> {
    const data = JSON.parse(JSON.stringify(params));
    const page = {};
    const {pKey} = props;
    page[pKey.cK] = data[pKey.cK] || 1;
    page[pKey.sK] = data[pKey.sK] || 20;
    param = {
        ...data,
        ...page,
    }
}

const scrollMain:any = ref(null);

async function request(params:any) {
    let res = null as any;
    loading.value = !0;
    resetParam(params || props.params);
    try {
        if(props.method === 'post') {
            res = await axios.post(props.url,param);
        } else if(props.method === 'get') {
            res = await axios.get(getUrlChange(props.url,param));
        }
        if (!res.state) throw Error('错误');
        pagingData.total = Number(res.message[props.rKey.total]);
        pagingData.pageSize = Number(res.message[props.rKey.size]);
        pagingData.current = Number(res.message[props.rKey.page]);
        scrollMain.value.scrollTop = 0;
        emit('setData',res.message);
    } catch (err) {
        console.log(err);
    } finally {
        loading.value = !1;
    }
}
function currentChange(current:number)  {
    pagingData.current = current;
    param[props.pKey.cK] = current;
    request(param);
}

watch(()=>props.pagination,(val)=>{
    for (const i in val) {
        if (i) pagingData[i] = val[i];
    }
})
// watch(()=>props.url,(val)=>{
// },{immediate:true})

const heightChange = computed(()=>{
    return {
        height: `calc(100% - ${props.showPagination ? 40 : 0}px)`
    };
})

defineExpose({
    request,
})
</script>

<template>
    <div class="pagination-page">
        <a-spin :loading="loading" :style="heightChange" tip="加载中...">
            <div ref="scrollMain" class="main scroll-bar">
                <slot />
            </div>
        </a-spin>

        <div v-show="showPagination" class="footer flex_center">
            <a-pagination v-bind="pagingData" @change="currentChange"/>
        </div>
        <emptyContainer v-show="pagingData.total <= 0" />
    </div>
</template>

<style lang="less" scoped>
.pagination-page {
    height: 100%;
    position: relative;
    .arco-spin {
        height: calc(100% - 40px);
        width: 100%
    }
    .main {
        height: 100%;
        overflow-y: auto;
    }
    .null {
        top: 0;
        left: 0;
    }
    .footer {
        padding: 4px 0;
    }
}
</style>