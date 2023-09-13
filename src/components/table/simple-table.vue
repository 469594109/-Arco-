<script lang='ts' setup>
import { reactive, watch, onBeforeUnmount, } from 'vue';
import axios from 'axios';
import { keys } from 'lodash';

const emit = defineEmits(['setList'])
const props = defineProps({
    // table需要使用的各种数据，也是使用组件必传项
    useParams: {
        type: Object,
        required: !0,
        /* 
            {
                以下3为必要的
                columns,传入表头
                url,传入请求地址
                params,传入请求参数
                其他a-table需要的参数可自定义是否传入
            }        
        */
    },
    // paramsKey: 请求中data的key名，可能每个人要的参数不一样，故设为自定义
    pKey: { 
        type: Object,
        default:()=>({
            sK: 'pageSize', // sizeKey名
            cK: 'curPageNo', // currentKey名
        })
    },
    // request Key: 请求中完成后，可能每个人返回的参数不一样，故设为自定义
    rKey: { 
        type: Object,
        default:()=>({
            dataK: 'message', // 返回数据的主体键名
            records: 'dataRows', // 主体中列表键名
            total: 'totalRecords', // 列表的总数据量
            current: 'curPageNo', // 当前页码
            size: 'pageSize', // 每页返回量
        })
    },
})

// 内部的params变量
const insideP = {} as any; 

// a-table 的配置项
const table = reactive({
    columns: [], // 表格头
    data: [], // 数据
    scroll: {y: '100%'}, // 默认开启滚动
    bordered: {
        wrapper: !1
    }, // 关闭边框
    pagination: {
        current: 1,
        pageSize: 20,
    }, // 分页默认值
    loading: !1, // 等待
}) as any;

// 请求的内容，用于后期退出页面时移除未成功的请求
const request = {
    url: '',
    data: {} as any,
};

// 初始化请求参数 页码等
function initParams() {
    const p = insideP;
    const tP = table.pagination;
    const { pKey } = props;    
    // 如果未传入页码参数，将以a-table初始化页码为准
    p[pKey.cK] || (p[pKey.cK] = tP.current);
    p[pKey.sK] || (p[pKey.sK] = tP.pageSize);

    request.data = insideP;
}

// 设置返回数据，总页码等
function setList(res:any) {
    const { rKey } = props;
    const data = res[rKey.dataK];
    const current = data[rKey.current] * 1;
    const total = data[rKey.total] * 1;
    const size = data[rKey.size] * 1;

    table.pagination.current = current;
    table.pagination.total = total;

    const arr = data[rKey.records].map((v:any, i:number) => {
        v.order = size * (current - 1) + i + 1;
        v.index = i;
        return v;
    });
    table.data = arr;
    emit('setList',JSON.parse(JSON.stringify(data)));
}

// 请求数据
async function getList() {
    table.loading = !0;
    initParams()
    try {
        const res = await axios.post(request.url, request.data) as any;
        setList(JSON.parse(JSON.stringify(res)));
        
    } catch(err){
        console.log(err);

    } finally {
        table.loading = !1;
    }
}

// 页码改变回调
function pageChange(page:number){
    const { pKey } = props;    
    insideP[pKey.cK] = page;
    getList();
}

// 重设table中的data数据，用于页面优化，如：数组中某个下标的状态变更，没必要重新请求一次
function resetList(data: never[]) {
    table.data = JSON.parse(JSON.stringify(data));
}

// 监听必传项的内容 取table需要的
watch(()=>props.useParams,(val:any)=>{
    if(keys(val).length){
        for(const key in table) {
            if(key === 'columns') 
                table[key] = val[key].map((v:any) => {
                    v.ellipsis = !0;
                    v.tooltip = !0;
                    return v;
                })
            else if(val[key]) table[key] = val[key];
        }
    }
},{immediate:!0});


watch(()=>props.useParams.url,(val:any)=>{
    if(val) {
        request.url = val;
        getList();
    }
},{immediate:!0});

// 页面销毁前
onBeforeUnmount(()=>{
    // console.log('销毁前需要移除未响应的请求');
})

// 导出实例的方法与变量
defineExpose({
    getList,
    resetList,
    table,
})

</script>

<template>
    <a-table 
        v-bind="table" @page-change="pageChange" >
        <template #state="{ record }">
            <slot name="state" :data="record" >
                <div class="slot-state flex">
                    <span class="spot" :class="`spot${record.state}`" />
                    <span class="text" >
                        {{ Number(record.state) ? '正常' : '暂停' }}
                    </span>
                </div>
            </slot>
        </template>
        <template #operation="{ record }">
            <slot name="operation" :data="record" />
        </template>
    </a-table>
</template>

<style lang="less" scoped>
.arco-table {
    height: 100%;
    --th_td-height: 42px;
}
// :deep(.arco-table-tr),
// :deep(.arco-table-td),
// :deep(.arco-table-cell),
// :deep(.arco-table-td-content),
// :deep(.arco-table-element),
// :deep(.arco-table-container) {
//     height: 100%;
// }
// :deep(.arco-scrollbar.arco-scrollbar-type-embed:nth-child(2)) {
//     height: calc(100% - var(--th_td-height));
// }
:deep(.arco-table-tr-empty .arco-table-td) {
    border-bottom: none;
}
:deep(.arco-empty) {
    margin: 80px 0;
}
:deep(.arco-table-th),
:deep(.arco-table-td) {
    height: var(--th_td-height);
}
:deep(.arco-table-cell) {
    padding-top: 0;
    padding-bottom: 0;
}
:deep(.arco-btn-size-medium) {
    height: 24px;
}
:deep(.arco-btn-size-mini) {
    font-size: 14px;
}
.slot-state {
    .spot {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin-right: 8px;

        &0 {
            background-color: rgb(var(--blue-6));
        }
        &1 {
            background-color: rgb(var(--green-6));
        }
    }
}
</style>
