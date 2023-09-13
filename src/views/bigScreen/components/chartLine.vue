<script lang="ts" setup>
import { ref, Ref } from 'vue';
import { getColRecord } from '@/api/bigScreen';
import * as echarts from 'echarts';
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
const emit = defineEmits(['nodesClick']);

const list:Ref = ref([]);

const { chartOption } = useChartOption(() => {
    const keyAxis = {
        axisLabel: {
            color: '#fff',
        },
        axisTick: {
            show: false,
        },
    };
    return {
        tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    type: 'solid',
                    color: 'rgba(57,218,252,0.7)'
                },
            },
        },
        // legend: {
            // orient: "vertical",
            // type: "scroll",
            // top: "10",
            // left: "20",
            // textStyle: {
            //     color: '#fff'
            // },
            // data: ['数量'],
        // },
        grid: {
            left: "20",
            right: "40",
            top: "50",
            bottom: "20",
            containLabel: !0
        },
        xAxis: {
            boundaryGap: false,
            type: 'category',
            data: list.value.map((v:any)=>v.name),
            position: 'bottom',
            ...JSON.parse(JSON.stringify(keyAxis)),
            
        },
        yAxis: {
            type: 'value',
            position: 'left',
            ...JSON.parse(JSON.stringify(keyAxis)),
            splitLine: {
                show: true,
                onZero: false,
                lineStyle:{
                    color: '#666',
                    type: 's'
                }
            },
        },
        series: [
            {
                type: 'line',
                data: list.value.map((v:any)=>v.value),
                // data: lineData.value.y.map(()=>Math.round(Math.random()*200)),
                smooth: 0.6,
                // symbol: 'none',
                itemStyle: {
                    color: 'rgb(57,218,252)'
                },
                lineStyle: {
                    width: 1
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgba(57,218,252,0.4)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(57,218,252,0.1)'
                        }
                    ])
                },
            }
        ]
    }
})

const getLineList = async ()=>{
    const { message } : any = await getColRecord();
    list.value = message.data;
}
getLineList();

function handleCLick(data: any) {
    emit('nodesClick',data);
}
</script>

<template>
    <container title="采集趋势" class="line-main">
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
                        :option="chartOption"
                        @nodes-click="handleCLick" />
                </a-card>
            </a-spin>
        </template>
    </container>
</template>

<style lang="less" scoped>
.line-main {
    width: 846px;
    // height: 370px;
    height: 100%;
    margin: 0 20px;
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