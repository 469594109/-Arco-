<script lang="ts" setup>
import { Ref, ref, } from 'vue';
// import { ref, computed, } from 'vue';
// import { ref, reactive, computed } from 'vue';
// import useChartOption from '@/hooks/chart-option';
import { getKeyWord } from '@/api/bigScreen';
import wordContainer from '@/components/chart/wordCloud.vue';
import container from './container.vue';

// const props = defineProps({});
// const props = defineEmits([]);;
defineProps({
    data: {
        type: [Object, Array],
        default: ()=>({})
    },
    loading: {
        type: Boolean,
        default: false,
    }
});
const emit = defineEmits(['nodesClick']);

const wordData:Ref = ref([]);
const getWord = async ()=> {
    try {
        const { message } : any = await getKeyWord();
        wordData.value = message.map((v:any)=>{
            return {
                name: v.word,
                value: v.count,
            }
        })
    } catch (err) {
        console.log(err);
    }
}
getWord();

function handleCLick(data: any) {
    // console.log(data);
    emit('nodesClick',data);
}
</script>

<template>
    <container title="词云分析" class="word-main">
        <template #main>
            <wordContainer :data="wordData" @nodes-click="handleCLick" />
        </template>
    </container>
</template>

<style lang="less" scoped>
.word-main {
    width: 470px;
    // height: 370px;
    height: 100%;
}
:deep(.arco-card) {
    height: 100%;
}
:deep(.arco-card-body) {
    height: 100%;
}
:deep(.arco-card) {
    background-color: transparent;
}
</style>