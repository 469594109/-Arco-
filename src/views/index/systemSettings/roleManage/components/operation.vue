
<script lang='ts' setup>
import { reactive,ref,watch,onBeforeUnmount, Ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
import { addData, upDataData, getMenuByDep } from '@/api/index/systemSettings/roleManage';
import useLoading from '@/hooks/loading';
import menuList from './menu.vue'

const props = defineProps({
    selectData: {
        type: Object,
        default: ()=>({}),
    }
});
const emit = defineEmits(['cancel']);

const menuListRefs:Ref = ref(null);

const formData = reactive({
    roleId: '',
    roleName: '',
    roleDesc: '',
    menuIds: '',
})
const { loading, setLoading } = useLoading();

const initForms = () => {
    const arr =  [
        {
            key: 'roleName',
            label: '角色名称',
            value: '',
            span: 24,
            type: 1,
            isDisable: !0,
            rules: [
                {
                    required: true, 
                    message: '请输入角色名称后提交！'
                }
            ],
            options: [],
            inputType: '',
            placeholder: '请输入角色名称',
        },
        {
            key: 'roleDesc',
            label: '角色描述',
            value: '',
            span: 24,
            type: 4,
            rules: [],
            options: [],
            inputType: '',
            placeholder: '角色描述',
        },
    ]
    const data = props.selectData;
    if (data.accountId) {
        arr.forEach((v:any)=> {
            data[v.key] && (formData[v.key] = data[v.key]);
            if (v.isEdit) {
                v.rules = [];
                formData[v.key] = '';
            }
        })
    }
    return arr;
}

const forms:Ref = ref(initForms());

const list:Ref = ref([]);

const getMenuList = async () => {
    const data = props.selectData;
    const { message }:any = await getMenuByDep(data?.roleId || '');
    list.value = message;
}

getMenuList();

const errorMessage = ref('');
const addForm = ref();

function cancel(str: string | undefined) {
    addForm.value.resetFields();
    emit('cancel',str);
}

async function submit({errors,values}:{
  errors: Record<string, ValidatedError> | undefined;
  values: any;
}) {
    if(!errors) {
        setLoading(true);
        try {
            let res:any;
            // console.log(menuListRefs.value);
            formData.menuIds = menuListRefs.value.selectMenu.map((v:any)=>v.menu_id);
            if (formData.roleId) res = await upDataData(values);
            
            else res = await addData(values) as any;

            if(res.state) {
                Message.success(res.message);

                cancel('success');
            }else Message.error(res.message);
        } catch(err) {
            console.log(err);
            errorMessage.value = (err as Error).message;
        } finally {
            setLoading(false);
        }
    }
}

watch(()=>props.selectData,(val: any)=>{
    if (val.roleId) {
        for (const i in formData) {
            if (val[i]) {
                formData[i] = val[i];
            }
        }
    }
},{immediate:!0})

onBeforeUnmount(()=>{
    // console.log('销毁前需要移除未响应的请求');
})
</script>

<template>
    <div class="operation">
        <div class="title">
            {{ selectData.accountId ? '修改' : '新增' }}
        </div>
        <div class="content">
            <a-form 
                ref="addForm"
                :model="formData"
                class="form"
                layout="inline"
                :style="{width:'800px'}"
                @submit="submit">
                <a-col :span='12'>
                    <template
                        v-for="(item, index) in forms" 
                        :key="index">
                        <a-col :span="item.span" style="min-height: 52px">
                            <a-form-item 
                                :field="item.key"
                                :label="item.label"
                                :validate-trigger="['change', 'blur']"
                                :rules="item.rules"
                                :label-col-style="{width: '120px'}">                            
                                <template v-if="item.type === 1">
                                    <a-input 
                                        v-model="formData[item.key]"
                                        :placeholder="item.placeholder" 
                                        :disabled="item.isDisable && selectData.accountId"
                                        :type="item.inputType || 'text'" />
                                </template>
                                <template v-else-if="item.type === 2">
                                    <a-select
                                        v-model="formData[item.key]"
                                        :options="item.options"
                                        :placeholder="item.placeholder" />
                                </template>
                                <template v-else-if="item.type === 3">
                                    <a-date-picker 
                                        v-model="formData[item.key]"
                                        :style="{width: '100%'}"/>
                                </template>
                                <template v-else-if="item.type === 4">
                                    <a-textarea 
                                        v-model="formData[item.key]"/>
                                </template>
                            </a-form-item>
                        </a-col>
                    </template>
                </a-col>
                <a-col :span='12'>
                    <menuList ref="menuListRefs" :list="list"/>
                </a-col>
                <div class="form-error-msg">{{ errorMessage }}</div>
                <a-col :span="24" class="footer" >
                    <a-button 
                        class="btn"
                        @click="cancel('')">
                        取消
                    </a-button>
                    <a-button 
                        class="btn"
                        type="primary" 
                        html-type="submit"
                        :loading="loading">
                        确定
                    </a-button>
                </a-col>
            </a-form>
        </div>
    </div>
</template>

<style lang="less" scoped>
.operation {
	background-color: var(--color-bg-1);
	border-radius: 4px;

    .title {
        height: 40px;
        box-shadow: 0px 1px 0px 0px rgba(19, 14, 18, 0.1);
        padding: 12px 10px;
        color: var(--color-text-2);
    }

    .form {
        padding: 30px 20px 40px;

        :deep(.arco-form-item-content-flex) {
            align-items: flex-start;
            justify-content: flex-end;
        }

        .key {
            padding-top: 9px;
            padding-right: 17px;
            color: var(--color-text-2);
            line-height: 14px;
        }
        .value {
            width: 280px;
        }
        &-error-msg {
            height: 32px;
            color: rgb(var(--red-6));
            line-height: 32px;
        }
    }

    .footer {
        margin-top: 10px;
        text-align: center;
        .btn {
            margin-right: 15px;
        }
    }
}

</style>