<template>
  <div class="content">
    <a-result class="result" status="404" :subtitle="!login?'登录过期，请重新登陆！':'not found'"> </a-result>

    <div class="operation-row">
      <a-button key="back" type="primary" @click="back"> back </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { getToken } from '@/utils/auth';
import { useRouter } from 'vue-router';

const login = computed(()=>{
    return !!getToken();
})
const router = useRouter();
const back = () => {
    if (login.value > !1) {
        router.back();
    } else {
        const currentRoute = router.currentRoute.value.redirectedFrom as any;
        router.push({
            name: 'login',
            query: {
                ...currentRoute.query,
                redirect: currentRoute.name as string,
            }, 
        });
    }
};
</script>

<style scoped lang="less">
  .content {
    // padding-top: 100px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -95px;
    margin-top: -121px;
    text-align: center;
  }
</style>
