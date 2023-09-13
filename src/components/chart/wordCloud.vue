<script lang="ts" setup>
import { computed, } from 'vue';
import useChartOption from '@/hooks/chart-option';
import emptyCOntainer from '@/components/empty/index.vue';
// import * as echarts from 'echarts';
// import { EChartsOption } from 'echarts/types/dist/echarts';
import 'echarts-wordcloud';

const props = defineProps({
    data: {
        type: [Object, Array],
        default: ()=>([])
    },
    loading: {
        type: Boolean,
        default: false,
    },
    showEmpty: {
        type: [Boolean,Number],
        default: true
    }
})
const emit = defineEmits(['nodesClick'])

const wordData = computed(()=>{
    const arr = Array.isArray(props.data) ? props.data : [];
    return arr as any;
    // return arr.map((v:any)=>({
    //     name: v.name,
    //     value: v.num,
    // }))
})

const { chartOption } = useChartOption(() => {
    return {
        tooltip: {
            show: true,
        },
        grid: {
            left: "20",
            right: "40",
            top: "20",
            bottom: "20",
            containLabel: !0
        },
        series: [
            {
                type: "wordCloud",
                // 网格大小，各项之间间距
                gridSize: 12,
                // 形状 circle 圆，cardioid  心， diamond 菱形，
                // triangle-forward 、triangle 三角，star五角星
                shape: "circle",
                // 字体大小范围
                sizeRange: [20, 50],
                // 文字旋转角度范围
                rotationRange: [0, 0],
                // rotationRange: [-90, 90],
                // 旋转步值
                rotationStep: 0,
                // rotationStep: 45,
                // 自定义图形
                // maskImage: maskImage,
                left: "center",
                top: "center",
                // right: '',
                // bottom: '',
                // 是否渲染超出画布的文字
                drawOutOfBound: false,
                data: wordData.value,
                textStyle: {
                    color() {
                        return `rgb(${[
                            Math.round(Math.random() * 200 + 55),
                            Math.round(Math.random() * 200 + 55),
                            Math.round(Math.random() * 200 + 55)
                        ].join(",")})`;
                    },
                    emphasis: {
                        shadowBlur: 10,
                        shadowColor: "#2ac"
                    }
                },
            }
        ]
    };
});

function handleCLick(data: any) {
    emit('nodesClick',data);
}
</script>

<template>
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
            <emptyCOntainer v-if="showEmpty" v-show="!loading && !data.length" />
        </a-card>
    </a-spin>
</template>

<style lang="less" scoped>
:deep(.arco-card) {
    height: 100%;
}
:deep(.arco-card-body) {
    height: 100%;
}

.null {
    top: 0;
    left: 0;
    // background-color: var(--color-bg-2);        
}
</style>