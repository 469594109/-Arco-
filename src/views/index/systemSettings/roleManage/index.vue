<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import { getAllUrl, delData } from '@/api/index/systemSettings/roleManage';
import mainLayout from '@/components/main-layout/index.vue';
import tableContainer from "@/components/table/table-page.vue";
import modalCover from '@/components/modal-cover/index.vue';
import operation from './components/operation.vue';

const tableExample = ref(null) as any;

function initTableColumns() {
    return [
        {
            title: '序号',
            dataIndex: 'order',
            width: 60,
        },
        {
            title: '角色编号',
            dataIndex: 'roleId',
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
        },
        {
            title: '角色描述',
            dataIndex: 'roleDesc',
        },
        {
            title: '操作',
            slotName: 'operation',
            width: 200
        },
    ];
}

const useParams = reactive({
    columns: initTableColumns(),
    url: getAllUrl,
})

const pKey = {
    sK: 'size',
    cK: 'current',
}

const rKey = {
    dataK: 'message',
    records: 'records',
    total: 'total',
    current: 'current',
    size: 'size',
}

const setFormItems = () => {
    return [
        {
            label: '角色名称',
            type: 1,
            placeholder: '请输入角色名称',
            key: 'roleName',
        },
    ];
};

const searchItems = ref(setFormItems());

const toSearch =  () => {
    tableExample.value.getList();
}

const show = reactive({
    add: false,
})
const selectData = ref({});

function add() {
    selectData.value = {};
    show.add = !0;
}

async function upData(data:any) {
    selectData.value = data;
    show.add = !0;
}

async function del(data:any) {
    try {
        const res = await delData({roleId: data.roleId}) as any;
        if (!res.state) throw Error(res);
        Message.success('任务删除成功！' || res.message);
        toSearch();
    } catch (err) {
        Message.error((err as Error).message);
    }
}

function handleCancel(str: string) {
    if (str === 'success') {
        toSearch();
    }
    show.add = !1;
}
</script>

<template>
    <mainLayout>
        <div class="main">
            <div class="table-box">
                <tableContainer 
                    ref="tableExample"
                    :use-params="useParams" 
                    :search-list="searchItems"
                    :p-key="pKey"
                    :r-key="rKey">
                    <template #searchBtns>
                        <div class="buttons">
                            <a-button 
                                type="primary" 
                                @click="add" >
                                <template #icon>
                                    <icon-plus />
                                </template>
                                <template #default>{{ $t('searchTable.operation.newlyAdd') }}</template>
                            </a-button>
                        </div>
                    </template>
                    <template #operation="{ data }">
                        <a-button type="text" size="mini" @click="upData(data)">修改</a-button>
                        <a-popconfirm 
                            type="warning"
                            content="是否删除此条数据？"
                            @ok="del(data)">
                            <a-button type="text" size="mini">删除</a-button>
                        </a-popconfirm>
                    </template>            
                </tableContainer>
            </div>
        </div>
        
        <transition name="model">
            <modalCover 
                    v-if="show.add">
                <operation 
                    :select-data="selectData"
                    @cancel="handleCancel" />
            </modalCover>
        </transition>
    </mainLayout>
</template>

<style lang="less" scoped>
.main {
    height: 100%;
    width: 100%;
    background: var(--color-bg-2);
    // padding: 20px;
    // padding-bottom: 0;
    // .buttons {
    //     height: 138px;
    //     margin-bottom: 20px;
    //     .arco-btn {
    //         margin-right: 10px;
    //     }
    // }
    .table-box {
        // height: calc(100% - 138px);
        height: calc(100%);
    }
}
</style>