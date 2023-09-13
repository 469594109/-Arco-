<script setup lang='ts'>
import { ref } from 'vue';
import { debounce } from "@/assets/js/library";

const emit = defineEmits(['toScrollTop','toScrollBottom'])
const scrollPage = ref() as any;

/* 滚动到顶|底|任意点 */
const toScrollTo = (num : number|string|undefined = 0)=> {
    // debugger;
    const sP = scrollPage.value;// 滚动条位置
    // debugger;
    if(num === 'bottom') sP.scrollTop = sP.scrollHeight;    
    else sP.scrollTop !== num && (sP.scrollTop = num);
}

const scrollChange = debounce((e:any)=> {
    const tar = e.target;
    if(tar.scrollTop <= 50) {
        emit('toScrollTop');
        
    } else if(tar.scrollTop + tar.offsetHeight + 50 >= tar.scrollHeight) {
        emit('toScrollBottom');
        
    }
},100);

defineExpose({
    toScrollTo,
    scrollPage,
})
</script>

<template>
    <div   
        ref="scrollPage"
        class="scroll-main scroll-bar"
        @scroll="scrollChange">
        <slot />
    </div>
</template>

<style lang="less" scoped>
    .scroll-main {
        height: 100%;
        width: 100%;
    }
</style>