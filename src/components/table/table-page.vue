<script lang="ts" setup>
import { ref, reactive, watch, onBeforeUnmount, } from 'vue';
import axios from 'axios';
import { keys } from 'lodash';

const props = defineProps({
    /* 以下为查询部分使用参数 */
    // 搜索界面的渲染，如几个input框，几个时间选择器等
    searchList: {
        type: Array,
        default:()=>[],
    /* 
    {
        label: '前缀名',
        type: 1, // 1 input 2 select 3 时间选择器
        placeholder: '请输入手机号', // 占位符内容
        key: 'phone', // key名
        options: [
            {
                label: '我爱你', // 选择框展示内容,
                value: 520, // value值
            }
        ],
        span: 6,// 容器宽 24栅格百分比 默认6
        offset: 0,// 左侧栅格间距 默认0
        xxl: // 各种宽度栅格
        xl: // 各种宽度栅格
        lg: // 各种宽度栅格
        md: // 各种宽度栅格
        sm: // 各种宽度栅格
    },
     */
    },
    /* 以下为表格部分使用参数 */
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
const emit = defineEmits(['setList']);

/* 以下为查询部分使用参数 start */
// 内部的params变量
let insideP = {} as any; 

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
/* 以下为查询部分使用参数 end */

/* 以下为查询部分使用参数 start */

/* 用户与初始form数据 */
const generateFormModel = () => {
    return {};
};

// 搜索表单的数据
const formModel = ref(generateFormModel());

/* 搜索按钮点击事件 */
const search = () => {
    insideP = formModel.value;
    getList();
};

/* 重置按钮点击事件 */
const reset = () => {
    formModel.value = generateFormModel();
    insideP = {};
    getList();
};
/* 以下为查询部分使用参数 end */

// 导出实例的方法与变量
defineExpose({
    /* 以下为搜索部分导出 */
    formModel,
    /* 以下为表格部分导出 */
    getList,
    resetList,
    table,
})
</script>

<template>
    <div class="table-search-main">
        <a-card class="general-card" title="查询表格">
            <a-row>
                <a-col :flex="1">
                    <a-form
                        :model="formModel"
                        :label-col-props="{ span: 6 }"
                        :wrapper-col-props="{ span: 18 }"
                        label-align="left">
                        <a-row :gutter="16">
                            <template v-for="(item,index) in (searchList as any)" :key="index">
                                <a-col 
                                    :span="item.span || 8" 
                                    :offset="item.offset || 0" 
                                    :xxl="item.xxl || 6"
                                    :xl="item.xl || 8"
                                    :lg="item.lg || 9"
                                    :md="item.md || 12"
                                    :sm="item.sm || 14"
                                     >
                                    <a-form-item
                                        :field="item.key"
                                        :label="item.label" >
                                        <a-input
                                            v-if="item.type === 1"
                                            v-model="formModel[item.key]"
                                            :placeholder="item.placeholder" />

                                        <a-select
                                            v-if="item.type === 2"
                                            v-model="formModel[item.key]"
                                            :options="item.options"
                                            :placeholder="item.placeholder" />
                                        <a-range-picker
                                            v-if="item.type === 3"
                                            v-model="formModel[item.key]"
                                            style="width: 100%" />
                                    </a-form-item>
                                </a-col>

                            </template>
                            
                            <!-- <a-col 
                                :span="8" 
                                :offset="0" 
                                :xxl="6"
                                :xl="8"
                                :lg="10"
                                :md="12"> -->
                                <a-space :size="16" style="padding-left: 8px;padding-bottom: 20px;">
                                    <a-button html-type="submit" type="primary" @click="search">
                                    <template #icon>
                                        <icon-search />
                                    </template>
                                    {{ $t('searchTable.form.search') }}
                                    </a-button>
                                    <a-button @click="reset">
                                    <template #icon>
                                        <icon-refresh />
                                    </template>
                                    {{ $t('searchTable.form.reset') }}
                                    </a-button>
                                    <slot name="searchBtns">  

                                    </slot>
                                </a-space>
                            <!-- </a-col> -->
                        </a-row>
                    </a-form>
                </a-col>
            </a-row>
            <a-divider  style="margin-top: 0"/>
            <a-row v-if="false" style="margin-bottom: 10px">
                <slot name="btnS">  

                </slot>
            </a-row>
            <!-- 以下内容待修改 -->
            <a-row v-if="false" style="margin-bottom: 16px">
                <a-col :span="12">
                    <a-space>
                        <a-button type="primary">
                            <template #icon>
                                <icon-plus />
                            </template>
                            {{ $t('searchTable.operation.create') }}
                        </a-button>
                        <a-upload action="/">
                            <template #upload-button>
                                <a-button>
                                {{ $t('searchTable.operation.import') }}
                                </a-button>
                            </template>
                        </a-upload>
                    </a-space>
                </a-col>
                <a-col
                :span="12"
                style="display: flex; align-items: center; justify-content: end"
                >
                <a-button>
                    <template #icon>
                    <icon-download />
                    </template>
                    {{ $t('searchTable.operation.download') }}
                </a-button>
                <a-tooltip :content="$t('searchTable.actions.refresh')">
                    <div class="action-icon" @click="search"
                    ><icon-refresh size="18"
                    /></div>
                </a-tooltip>
                <!-- <a-dropdown @select="handleSelectDensity">
                    <a-tooltip :content="$t('searchTable.actions.density')">
                    <div class="action-icon"><icon-line-height size="18" /></div>
                    </a-tooltip>
                    <template #content>
                    <a-doption
                        v-for="item in densityList"
                        :key="item.value"
                        :value="item.value"
                        :class="{ active: item.value === size }"
                    >
                        <span>{{ item.name }}</span>
                    </a-doption>
                    </template>
                </a-dropdown> -->
                <!-- <a-tooltip :content="$t('searchTable.actions.columnSetting')">
                    <a-popover
                    trigger="click"
                    position="bl"
                    @popup-visible-change="popupVisibleChange"
                    >
                    <div class="action-icon"><icon-settings size="18" /></div>
                    <template #content>
                        <div id="tableSetting">
                        <div
                            v-for="(item, index) in showColumns"
                            :key="item.dataIndex"
                            class="setting"
                        >
                            <div style="margin-right: 4px; cursor: move">
                            <icon-drag-arrow />
                            </div>
                            <div>
                            <a-checkbox
                                v-model="item.checked"
                                @change="handleChange($event, item as TableColumnData, index)"
                            >
                            </a-checkbox>
                            </div>
                            <div class="title">
                            {{ item.title === '#' ? '序列号' : item.title }}
                            </div>
                        </div>
                        </div>
                    </template>
                    </a-popover>
                </a-tooltip> -->
                </a-col>
            </a-row>
            <div class="table-main">
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
                    <!-- <template #empty>
                        <slot name="empty">
                            <div style="height:100%">
                                <a-empty>

                                </a-empty>
                            </div>
                        </slot>
                    </template> -->
                </a-table>
            </div>
        </a-card>
    </div>
</template>

<style lang="less" scoped>
.table-search-main {
    height: 100%;
    :deep(.arco-card-header-title) {
        height: 25px;
    }
    :deep(.arco-card) {
        height: 100%;
    }
    :deep(.arco-card-body) {
        height: calc(100% - 65px);
        overflow-y: auto;
    }
    .action-icon {
        margin-left: 12px;
        cursor: pointer;
    }
    .active {
        color: #0960bd;
        background-color: #e3f4fc;
    }
    .setting {
        display: flex;
        align-items: center;
        width: 200px;
        .title {
            margin-left: 12px;
            cursor: pointer;
        }
    }
    .table-main {
        // height: calc(100% - 52px - 21px - 42px);
        height: calc(100% - 52px - 21px);
        padding-bottom: 4px;
        --th_td-height: 42px;

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
    }
}
:deep(.arco-table-th) {
    &:last-child {
        .arco-table-th-item-title {
            margin-left: 16px;
        }
    }
}
</style>