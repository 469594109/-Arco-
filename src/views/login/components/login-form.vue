<script lang = "ts" setup >
import { 
    ref, 
    reactive
 } from 'vue';
import { Base64 } from '@/assets/js/library';
import { useRouter, } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
import { useI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import type { LoginData } from '@/api/user';
import { useUserStore } from '../../../store';
import useLoading from '../../../hooks/loading';

const router = useRouter();
const { t } = useI18n();
const errorMessage = ref('');
const { loading, setLoading } = useLoading();
const userStore = useUserStore();
const loginConfig = useStorage('login-config', {
  rememberPassword: true,
  accountId: '', // 演示默认值
  password: '', // demo default value
});

function decodeStr(str:string) {
    str && str.length && (str = Base64.decode(str));
    return str || '';
}

const userInfo = reactive({
  accountId: decodeStr(loginConfig.value.accountId),
  password: decodeStr(loginConfig.value.password),
});


const handleSubmit = async ({
  errors,
  values,
}: {
  errors: Record<string, ValidatedError> | undefined;
  values: any;
}) => {
    if (loading.value) return;
    if (!errors) {
        setLoading(true);
        try {
            const data = {
                accountId : Base64.encode(values.accountId),
                password : Base64.encode(values.password),
            }
            
            const message =  await userStore.login(data as LoginData);
            const { redirect, ...othersQuery } = router.currentRoute.value.query;
            // 默认使用上一个重定向路由，无路由使用第一个菜单路径，无菜单路径使用oneSearch
            router.push({
                name: (redirect as string) || message || 'oneSearch',
                query: {
                    ...othersQuery,
                },
            });
            Message.success(t('login.form.login.success'));
            const { rememberPassword } = loginConfig.value;
            const { accountId, password } = data;
            
            loginConfig.value.accountId = rememberPassword ? accountId : '';
            loginConfig.value.password = rememberPassword ? password : '';
        } catch (err) {
            Message.error((err as any).message);
            errorMessage.value = (err as Error).message;
        } finally {
            setLoading(false);
        }
    }
};
const setRememberPassword = (value: boolean) => {
  loginConfig.value.rememberPassword = value;
};
</script>

<template>
    <div class="login-form-wrapper">
        <div class="flex_between login-form-title-box">
            <!-- <div class="login-form-title"></div> -->
            <div class="login-form-title flex">
                <img src="@/assets/images/login/logo.png">
                {{ $t('login.form.welcome') }}{{ $t('login.form.title') }}
            </div>
        </div>
        <div class="login-form-error-msg">{{ errorMessage }}</div>
        <a-form 
                ref="loginForm"
                :model="userInfo"
                class="login-form"
                layout="vertical"
                @submit="handleSubmit">
            <a-form-item 
                        field="accountId"
                        :rules="[{ required: true, message: $t('login.form.accountId.errMsg') }]"
                        :validate-trigger="['change', 'blur']"
                        hide-label>
                <a-input 
                        v-model="userInfo.accountId"
                        :placeholder="$t('login.form.accountId.placeholder')">
                    <template #prefix>
                        <icon-user />
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item 
                        field="password"
                         :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
                         :validate-trigger="['change', 'blur']"
                         hide-label>
                <a-input-password 
                                v-model="userInfo.password"
                                :placeholder="$t('login.form.password.placeholder')"
                                allow-clear>
                    <template #prefix>
                        <icon-lock />
                    </template>
                </a-input-password>
            </a-form-item>
            <a-space 
                    :size="16"
                    direction="vertical">
                <div class="login-form-password-actions">
                    <a-checkbox 
                                checked="rememberPassword"
                                :model-value="loginConfig.rememberPassword"
                                @change="(setRememberPassword as any)">
                        {{ $t('login.form.rememberPassword') }}
                    </a-checkbox>
                    <!-- <a-link>{{ $t('login.form.forgetPassword') }}</a-link> -->
                </div>
                <a-button 
                        type="primary"
                        html-type="submit"
                        long
                        :loading="loading">
                    {{ $t('login.form.login') }}
                </a-button>
            </a-space>
        </a-form>
    </div>
</template>

<style lang="less" scoped>
.login-form {
  &-wrapper {
    width: 320px;
  }

  &-title-box {
    flex-flow: column wrap;
    justify-content: center;
    height: 66px;
    width: 240px;
    margin: 0 auto;
  }

  &-title {
    color: var(--color-text-2);
    font-weight: 500;
    font-size: 24px;
    line-height: 24px;
    width: 100%;
    img {
        margin-right: 10px;
    }
  }

  &-sub-title {
    color: var(--color-text-3);
    font-size: 16px;
    line-height: 24px;
  }

  &-error-msg {
    height: 32px;
    color: rgb(var(--red-6));
    line-height: 32px;
  }

  &-password-actions {
    padding: 5px 0 10px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
