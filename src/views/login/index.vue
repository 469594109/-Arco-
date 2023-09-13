<script lang="ts" setup>
import LoginForm from './components/login-form.vue';
</script>

<template>
    <div class="container flex">
        <div class="content-inner">
            <LoginForm />
        </div>
    </div>
</template>

<style lang="less" scoped>
.container {
    display: flex;
    height: 100vh;
    overflow-x: auto;
    justify-content: flex-end;
    background: url('@/assets/images/login/big-bg.png') no-repeat;
    background-size: cover;
    .content-inner {
        background-color: var(--color-bg-2);
        width: 410px;
        height: 466px;
        display: flex;
        justify-content: center;
        padding-top: 40px;
        margin: 0 20%;
        box-shadow: 0px 7px 18px 0px rgba(22, 93, 255, 0.35);
        border-radius: 4px;
    }
}
</style>