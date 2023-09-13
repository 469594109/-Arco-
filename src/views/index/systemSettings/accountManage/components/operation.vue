
<script lang='ts' setup>
import { reactive,ref,watch,onBeforeUnmount } from 'vue';
import { datePickerBtn } from '@/assets/js/commonFun';
import { Message } from '@arco-design/web-vue';
import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
import { addAcc, upDataAcc, getRoleList } from '@/api/index/systemSettings/accountManage';
import useLoading from '@/hooks/loading';

const props = defineProps({
    selectData: {
        type: Object,
        default: ()=>({}),
    }
});
const emit = defineEmits(['cancel']);

const formData = reactive({
    accountId: '',
    accountName: '',
    accountMobile: '',
    roleId: '',
    password: '',
    checkPassword: '',
    accountDuty: '',
    email: '',
    expireTime: '',
    telephone: '',
    accountMemo: '',

})
const { loading, setLoading } = useLoading();

const testPwd = (val: string,cb: any) => {
    if (formData.password !== formData.checkPassword) {
        cb('两次密码不一致！');
    }
}

const initForms = () => {
    const arr =  [
        {
            key: 'accountId',
            label: '账号',
            value: '',
            span: 12,
            type: 1,
            isDisable: !0,
            rules: [
                {
                    required: true, 
                    message: '请输入账号后提交！'
                }
            ],
            options: [],
            inputType: '',
            placeholder: '请输入账号',
        },
        {
            key: 'accountName',
            label: '真实姓名',
            value: '',
            span: 12,
            type: 1,
            rules: [
                {
                    required: true, 
                    message: '请输入真实姓名后提交！'
                }
            ],
            options: [],
            inputType: '',
            placeholder: '请输入真实姓名',
        },
        {
            key: 'accountMobile',
            label: '手机号',
            value: '',
            span: 12,
            type: 1,
            rules: [
                {
                    required: true, 
                    message: '请输入手机号后提交！'
                }
            ],
            options: [],
            inputType: '',
            placeholder: '请输入手机号',
        },
        {
            key: 'roleId',
            label: '角色权限',
            value: '',
            span: 12,
            type: 2,
            rules: [
                {
                    required: true, 
                    message: '请选择角色权限后提交！'
                }
            ],
            options: [],
            inputType: '',
            placeholder: '请选择角色权限',
        },
        {
            key: 'password',
            label: '密码',
            value: '',
            span: 12,
            type: 1,
            rules: [
                {
                    required: true, 
                    message: '请输入密码后提交！'
                },
                {
                    minLength: 6,
                    maxLength: 20,
                    message: '密码长度为6-20位！'
                },
                {
                    validator: testPwd,
                }
            ],
            isEdit: true,
            options: [],
            inputType: 'password',
            placeholder: '请输入密码(6-20位非空白字符)',
        },
        {
            key: 'checkPassword',
            label: '确认密码',
            value: '',
            span: 12,
            type: 1,
            rules: [
                {
                    required: true, 
                    message: '请验证密码后提交！'
                },
                {
                    minLength: 6,
                    maxLength: 20,
                    message: '密码长度为6-20位！'
                },
                {
                    validator: testPwd,
                }
            ],
            isEdit: true,
            options: [],
            inputType: 'password',
            placeholder: '请验证密码(6-20位非空白字符)',
        },
        {
            key: 'accountDuty',
            label: '职务',
            value: '',
            span: 12,
            type: 1,
            rules: [],
            options: [],
            inputType: '',
            placeholder: '请输入职务',
        },
        {
            key: 'email',
            label: '邮箱',
            value: '',
            span: 12,
            type: 1,
            rules: [],
            options: [],
            inputType: '',
            placeholder: '请输入邮箱',
        },
        {
            key: 'expireTime',
            label: '到期时间',
            value: '',
            span: 12,
            type: 3,
            rules: [
                {
                    required: true, 
                    message: '请选择到期时间后提交！'
                }
            ],
            options: [],
            inputType: '',
            placeholder: '请选择到期时间',
        },
        {
            key: 'telephone',
            label: '联系电话',
            value: '',
            span: 12,
            type: 1,
            rules: [],
            options: [],
            inputType: '',
            placeholder: '请输入联系电话',
        },
        {
            key: 'accountMemo',
            label: '备注',
            value: '',
            span: 24,
            type: 4,
            rules: [],
            options: [],
            inputType: '',
            placeholder: '备注',
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

const timeBtn = datePickerBtn();

const forms:any = ref(initForms());

const getSelectList = async () => {
    const { message }:any = await getRoleList();
    const arr = message.map((v:any)=> {
        return {
            value: v.no,
            label: v.name
        }
    })
    forms.value.forEach((v: any)=>{
        v.key === 'roleId' && (v.options = arr);
    })
}

getSelectList();

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
            if (props.selectData.accountId) res = await upDataAcc(values);
            else res = await addAcc(values) as any;

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
    console.log(val);
    if (val.accountId) {
        forms.value.forEach((v:any)=> {
            val[v.key] && (formData[v.key] = val[v.key]);

        })
    }
})

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
                                    :disabled="item.isDisable && !!(selectData.accountId)"
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
                                    show-time
                                    :shortcuts="timeBtn"
                                    :style="{width: '100%'}"/>
                            </template>
                            <template v-else-if="item.type === 4">
                                <a-textarea 
                                    v-model="formData[item.key]"/>
                            </template>
                        </a-form-item>
                    </a-col>
                </template>
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