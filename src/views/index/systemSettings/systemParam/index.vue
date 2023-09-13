<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import { getAllUrl, addSystem, upDataSystem, delSystem } from '@/api/index/systemSettings/systemParam';
import mainLayout from '@/components/main-layout/index.vue';
import tableContainer from "@/components/table/simple-table.vue";


const tableExample = ref(null) as any;

function initTableColumns() {
    return [
        {
            title: '序号',
            dataIndex: 'order',
            width: 60,
        },
        {
            title: '参数组',
            dataIndex: 'paramClassify'
        },
        {
            title: '参数名称',
            dataIndex: 'paramName'
        },
        {
            title: '对应字段',
            dataIndex: 'paramKey',
        },
        {
            title: '值',
            dataIndex: 'paramValue',
        },
        {
            title: '操作',
            slotName: 'operation',
            width: 200
        },
    ];
}
// const setFormItems = () => {
//     return [
//         {
//             label: '查询手机',
//             type: 1,
//             placeholder: '请输入手机号',
//             key: 'phone',
//         },
//         {
//             label: '状态',
//             type: 2,
//             placeholder: '请选择状态',
//             options: [
//                 {
//                     label: '全部',
//                     value: '',
//                 },
//                 {
//                     label: '正常',
//                     value: 1,
//                 },
//                 {
//                     label: '暂停',
//                     value: 0,
//                 },
//             ],
//             key: 'state',
//         },
//     ];
// };

// const searchItems = ref(setFormItems());

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

const toSearch =  () => {
    tableExample.value.getList();
}

const selectData = reactive({
    show: false,
    edit: false,
})

const resetForm = ()=>{
    return {
        paramClassify: '',
        paramName: '',
        paramKey: '',
        paramValue: '',
    }
}

const form = ref(resetForm());

function add() {
    form.value = resetForm();
    selectData.edit = false;
    selectData.show = !0;
    // emit('addAccount');
}

async function upData(data:any) {
    selectData.edit = true;
    for (const key in form.value) {
        if (data[key]) form.value[key] = data[key];
    }
    selectData.show = !0;
}

async function del(data:any) {
    try {
        const res = await delSystem(data) as any;
        if (!res.state) throw Error(res);
        Message.success('任务删除成功！' || res.message);
        toSearch();
    } catch (err) {
        Message.error((err as Error).message);
    }
}

const handleBeforeOk = async ()=> {
    try {
        for (const key in form.value) {
            if (!form.value[key]) throw Error('请输入内容后提交。')
        }
        let res
        if (selectData.edit) res = await upDataSystem(form.value) as any;
        else  res = await addSystem(form.value) as any;
        // const { message } = await addSystem(form.value) as any;
        Message.success({id: 'success',content: res.message});
        toSearch();
        return true;
    }catch (err) {
        Message.error({id: 'err',content: (err as any).message});
        return false;
    }
}

function handleCancel() {
    selectData.show = !1;
}
</script>

<template>
    <mainLayout>
        <div class="main">
            <div class="buttons flex">
                <a-button type="primary" @click="add">新增</a-button>
                <a-button type="primary" @click="toSearch">刷新</a-button>
            </div>
            <div class="table-box">
                <tableContainer 
                    ref="tableExample"
                    :use-params="useParams" 
                    :p-key="pKey"
                    :r-key="rKey">
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
        <a-modal 
            v-model:visible="selectData.show"
            unmount-on-close 
            :on-before-ok="handleBeforeOk"
            @cancel="handleCancel">
            <template #title>
                {{ selectData.edit && '修改参数' || '新增参数' }}
            </template>
            <div>
                <a-form :model="form">
                    <a-form-item 
                        field="paramClassify" 
                        label="参数组"
                        :rules="[{ required: true, message: '请输入参数组后提交' }]">
                        <a-input v-model="form.paramClassify" placeholder="请输入参数组" />
                    </a-form-item>
                    <a-form-item 
                        field="paramName" 
                        label="参数名称"
                        :rules="[{ required: true, message: '请输入参数名称后提交' }]">
                        <a-input v-model="form.paramName" placeholder="请输入参数名称" />
                    </a-form-item>
                    <a-form-item 
                        field="paramKey" 
                        label="对应字段"
                        :rules="[{ required: true, message: '请输入对应字段后提交' }]">
                        <a-input v-model="form.paramKey" placeholder="请输入对应字段" />
                    </a-form-item>
                    <a-form-item 
                        field="paramValue" 
                        label="值"
                        :rules="[{ required: true, message: '请输入值后提交' }]">
                        <a-input v-model="form.paramValue" placeholder="请输入值" />
                    </a-form-item>
                </a-form>
            </div>
        </a-modal>
    </mainLayout>
</template>

<style lang="less" scoped>
.main {
    height: 100%;
    width: 100%;
    background: var(--color-bg-2);
    padding: 20px;
    padding-bottom: 0;
    .buttons {
        // height: 72px;
        margin-bottom: 20px;
        .arco-btn {
            margin-right: 10px;
        }
    }
    .table-box {
        height: calc(100% - 72px);
    }
}
</style>