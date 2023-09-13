<script lang="ts" setup>
import { ref,Ref } from 'vue';
// import { ref, reactive, computed } from 'vue';
import { fileStatistics } from '@/api/bigScreen';
import useChartOption from '@/hooks/chart-option';
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
// const emit = defineEmits(['nodesClick']);

const list:Ref = ref([]);

const { chartOption } = useChartOption(() => {
    return {
        tooltip: {
            trigger: "item",
            formatter: "{b} : {c} ({d}%)"
        },
        legend: {
            orient: "vertical",
            type: "scroll",
            top: "35%",
            right: "30",
            textStyle: {
                color: '#fff'
            }
        },
        series: {
            type: "pie",
            radius: ["28%", "50%"],
            center: ["30%", "50%"],

            label: {
                show: !1,
                formatter: ["{b|{b}}", "{d|({d}%)}"].join(""),
                rich: {
                    b: {
                        color: '#fff'
                    },
                    d: {
                        color: "#1a92f5"
                    }
                }
            },
            emphasis: {
                // scale: false,
                // scaleSize: 20,
            },
            data: list.value || []
        }
    }
})

const getPieList = async ()=>{
    const { message } : any = await fileStatistics();
    list.value = message.data;
}
getPieList();
</script>

<template>
    <container title="文件资源统计" class="pie-main">
        <template #main>
            <a-spin :loading="loading" style="height:100%;width: 100%">
                <a-card
                    class="general-card"
                    :header-style="{ paddingTop: '10px',paddingBottom: '0' }"
                    :body-style="{
                        padding: '10px',
                    }"
                    >
                    <Chart 
                        height="100%" 
                        :option="chartOption" />
                </a-card>
            </a-spin>
        </template>
    </container>
</template>

<style lang="less" scoped>
.pie-main {
    width: 520px;
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