
<script lang='ts' setup>
import { reactive,ref,onBeforeUnmount } from 'vue';
import { Message } from '@arco-design/web-vue';
import { getNationList, addAcc } from '@/api/index/collectionAccount';
import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
import useLoading from '@/hooks/loading';

const emit = defineEmits(['cancel'])

const formData = reactive({
    countryCode: '',
    phone: '',
    appId: '',
    remark: '',
})
const { loading, setLoading } = useLoading();

const errorMessage = ref('');
const addForm = ref();

function cancel(str: string | undefined) {
    addForm.value.resetFields();
    emit('cancel',str);
}

const nationList = ref();
async function getNation() {
    const { message } = await getNationList() as any;
    nationList.value = message as any[];
}
getNation();

async function submit({errors,values}:{
  errors: Record<string, ValidatedError> | undefined;
  values: any;
}) {
    if(!errors) {
        setLoading(true);
        try {
            const res = await addAcc(values) as any;
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

onBeforeUnmount(()=>{
    // console.log('销毁前需要移除未响应的请求');
})
</script>

<template>
    <div class="operation">
        <div class="title">
            {{ $t('cAccount.operation.title') }}
        </div>
        <div class="content">
            <a-form 
                ref="addForm"
                :model="formData"
                class="form"
                layout="vertical"
                @submit="submit">
                <a-form-item 
                    field="countryCode"
                    :rules="[{ required: true, message: $t('cAccount.operation.countryCode.message') }]"
                    :validate-trigger="['change', 'blur']"
                    hide-label>
                    <div class="key">
                        {{ $t('cAccount.operation.form.countryCode') }}
                    </div>
                    <div class="value">
                        <a-select 
                            v-model:modelValue="formData.countryCode"
                            :default-value="'telegram'"
                            :placeholder="$t('cAccount.operation.form.countryCode.placeholder')"
                            allow-clear 
                            show-search >
                            <a-option 
                                v-for="(item, index) of nationList" 
                                :key="index" 
                                :value='item.no'
                                :label="item.name" />
                        </a-select>
                    </div>
                </a-form-item>
                <a-form-item 
                    field="phone"
                    :rules="[{ required: true, message: $t('cAccount.operation.phone.message'), minLength: 5, }]"
                    :validate-trigger="['change', 'blur']"
                    hide-label>
                    <div class="key">
                        {{ $t('cAccount.operation.form.phone') }}
                    </div>

                    <div class="value">
                        <a-input 
                            v-model="formData.phone"
                            :min-length="5"
                            :max-length="15"
                            :placeholder="$t('cAccount.operation.form.phone.placeholder')" />
                    </div>

                </a-form-item>
                <a-form-item 
                    field="appId"
                    :rules="[{ required: true, message: $t('cAccount.operation.appId.message') }]"
                    :validate-trigger="['change', 'blur']"
                    hide-label>
                    <div class="key">
                        {{ $t('cAccount.operation.form.appId') }}
                    </div>
                    <div class="value">
                        <!-- <a-input 
                            v-model="formData.appId"
                            :placeholder="$t('cAccount.operation.form.appId.placeholder')" >
                        </a-input> -->
                        <a-select 
                            v-model:modelValue="formData.appId"
                            :default-value="'telegram'"
                            :placeholder="$t('cAccount.operation.form.appId.placeholder')"
                            allow-clear 
                            show-search >
                            <a-option key='1' value='telegram' >
                                telegram
                            </a-option>
                        </a-select>
                    </div>
                </a-form-item>
                <a-form-item 
                    field="remark"
                    hide-label>
                    <div class="key">
                        {{ $t('cAccount.operation.form.remark') }}
                    </div>
                    <div class="value">
                        <a-textarea 
                            v-model="formData.remark" />
                    </div>
                </a-form-item>
                <div class="form-error-msg">{{ errorMessage }}</div>
                <div class="footer">
                    <a-button 
                        class="btn"
                        @click="cancel('')">
                        {{ $t('cAccount.operation.cancel') }}
                    </a-button>
                    <a-button 
                        class="btn"
                        type="primary" 
                        html-type="submit"
                        :loading="loading">
                        {{ $t('cAccount.operation.submit') }}
                    </a-button>
                </div>
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
        padding: 54px 20px 40px;

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