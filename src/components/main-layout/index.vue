<script lang="ts" setup>
import { computed, } from 'vue';
import { useRoute, } from 'vue-router';

const route = useRoute();


const props = defineProps({
    padding: {
        /* 外边距 */
        type: Number,
        default: 20
    },
    crumbs: {
        /* 注意 传值 字符串逗号分隔;数组请自行map名字，不进行深层获取如：['菜单一','菜单二'];不传值取路由数据 */
        type: [String, Array],
        default: '',
    },
    crumbsEvent: {
        /* 用于点击事件 */
        type: Boolean,
        default: false,
    },
    showCrumbs: {
        type: Boolean,
        default: !1,
    }
})

const emit = defineEmits(['crumbsClick'])

const mainHeight = computed(()=>{
    return props.showCrumbs
})

const crumbsList = computed(()=>{
    if (!props.showCrumbs) {
        return [];
    } 
    if (props.crumbs) {
        if(Array.isArray(props.crumbs)) return props.crumbs;
        return props.crumbs.split(',')
    } 
    const strArr = route.matched.filter(v=>v.meta.title).map((v)=>v.meta.title);
    return strArr;
    
})


function crumbClick(item: unknown) {
    if (props.crumbsEvent) {
        emit('crumbsClick',item);
    };
};
</script>

<template>
    <div 
        class="main-layout"
        :class="{
            'show-crumbs': mainHeight
        }"
        :style="{
            padding: `${padding}px`
        }" >
        <div v-if="showCrumbs" class="crumbs-main" >
            <a-breadcrumb>
                <template v-for="item in crumbsList" :key="item">
                    <a-breadcrumb-item 
                        :class="{active: crumbsEvent}"
                        @click="crumbClick(item)">{{ item }}</a-breadcrumb-item>
                </template>
            </a-breadcrumb>
        </div>
        <div class="layout-content">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="less" scoped>
.main-layout {
    width: 100%;
    height: 100%;
    --crumbs-height: 0px;
    &.show-crumbs {
        --crumbs-height: 44px;
        .crumbs-main {
            margin-top: 0;
            margin-bottom: 20px;
            :deep(.active) {
                cursor: pointer;
            }
        }
    }
    .layout-content {
        height: calc(100% - var(--crumbs-height));
    }
}
</style>