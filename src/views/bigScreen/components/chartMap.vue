<script lang="ts" setup>
import { Ref, ref, } from 'vue';
import * as echarts from 'echarts';
import { chinaMap } from '@/api/bigScreen';
import useChartOption from '@/hooks/chart-option';
import geoJson from "@/assets/mapGeo/china.json";
import container from './container.vue';
// const props = defineProps({});
// const props = defineEmits([]);;

const emit = defineEmits(['nodesClick']);

const loading = ref(false);
const list:Ref = ref([]);

const getHotspotList = async ()=>{
    loading.value = true;
    const { message } : any = await chinaMap();
    list.value = message;
    loading.value = false;
}
getHotspotList();

echarts.registerMap("china", geoJson as any);

const { chartOption } = useChartOption(() => {
    return {
        // backgroundColor: "rgb(121,145,200)",
        tooltip: {
            formatter: (data:any)=> {
                if (data.data) {
                    return `${data.data.name}<br />群数量: ${data.data.valueG}<br />账号数量: ${data.data.valueM}`;
                }
                return ``;
            },
        },
        // geo: {} as any,
        // 配置地图相关的数据参数
        series: [
            {
                type: "map",
                map: "china",
                roam: !0,
                center: [105.159257, 34.600612],
                zoom: 1.5,
                scaleLimit: {
                    min: 1,
                    max: 15,
                },
                nameMap: {
                    china: '中国'
                },
                label: {
                    show: true,
                    // color: "#1DE9B6",
                    color: '#fff',
                    
                },
                itemStyle: {
                // 背景色
                //     backgroundColor: "rgb(147,235,248)",
                // 边框
                //     borderWidth: 1,
                // 区域颜色
                    // areaColor: {
                    //     type: "radial",
                    //     x: 0.5,
                    //     y: 0.5,
                    //     // 文档
                    //     r: 0.8,
                    //     colorStops: [
                    //         { offset: 0, color: "rgb(34,54,150)" },
                    //         { offset: 1, color: "rgb(89,128,142)" },
                    //     ],
                    //     // 全局生效
                    //     globalCoord: true,
                    // },
                    areaColor: '#488EF5',
                // 高亮效果
                },
                emphasis: {
                    // focus: 'self',
                    label: {
                        // color: 'red'
                        color: '#fff'
                    },
                    itemStyle: {
                        // areaColor: "rgb(46,229,206)",
                        areaColor: "#39DAFC",
                        borderWidth: 0.1,
                    }
                },
                select: {
                    label: {
                        color: '#fff',
                    }
                },
                blur: {
                    itemStyle: {
                        opacity: 0.7,
                    }
                },
                // data: mapData.value,
                data: list.value,
            },
        ],
    };
});

function handleCLick(data: any) {
    emit('nodesClick',data);
}
</script>

<template>
    <container title="国家/地区分布" class="map-main">
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
.map-main {
    width: 846px;
    height: 558px;
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