<script lang="ts" setup>
// import { computed } from 'vue';
// import { useAppStore } from '@/store';

// const appStore = useAppStore();

// const navbar = computed(() => appStore.navbar);

defineProps({
    mask: {
        type: Boolean,
        default: !0,
    }
})
</script>

<template>
    <div class="cover flex_center" :class="{mask:mask}" >
        <div :class="{'box-shadow':!mask}">
            <slot />
        </div>
    </div>
</template>

<style lang="less" scoped>
.cover {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 101;
    width: 100%;
    height: 100%;
    overflow: auto;
    &.mask {
        background-color: var(--color-mask-bg);
    }
    .box-shadow {
        box-shadow: 0px 0px 10px #aaa;
    }
}
</style>