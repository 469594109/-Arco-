<script lang="ts" setup>
import { ref, Ref } from 'vue';
import { statistics } from '@/api/bigScreen';
import container from './container.vue';

function resetList() {
    return [
        {
            title: '账号总量',
            value: 0,
            type: 1,
            percentage: 10,
            unit: 'W+',
            style: 'background-image:linear-gradient(to bottom,#43BCDE,#0097F0);'
        },
        {
            title: '群频数量',
            value: 0,
            type: 1,
            percentage: 15,
            unit: 'W+',
            style: 'background-image:linear-gradient(to bottom,#BCD800,#25D94B);',
            
        },
        {
            title: '群聊总量',
            value: 0,
            type: 0,
            percentage: 3,
            unit: 'W+',
            style: 'background-image:linear-gradient(to bottom,#FF8D4F,#FF5984);',
            
        },
        {
            title: '号码落查',
            value: 0,
            type: 0,
            percentage: 2,
            unit: 'W+',
            style: 'background-image:linear-gradient(to bottom,#E6E614,#FF6D00);',
            
        },
    ]
}
// const graphsUp = [26,30,40,50,60,64,58,74,78,84,100];
// const graphsDown = [100,84,76,66,56,66,66,50,50,28,24];
const list:Ref = ref(resetList());
const getLineList = async ()=>{
    const { message } : any = await statistics();
    list.value.forEach((v:any,i:number)=>{
        const item = message.data[i]
        v.value = Number(item.value);
        v.showUnit = v.value > 999999;
        v.type = Number(item.increase >= 0);
        v.percentage = Number((item.increase / 100).toFixed(1));
    })
}
getLineList();
</script>

<template>
    <container title="采集数据统计" class="data-stat" >
        <template #main>
            <template v-for="(item, index) in list" :key="index">
                <div class="item flex_between">
                    <a-statistic
                        :title="item.title"
                        :value="item.value"
                        :precision="0"
                        :value-from="0"
                        show-group-separator
                        animation
                        style="">
                        <!-- <template v-if="item.showUnit" #suffix >
                            <span class="unit">{{ item.unit }} </span>
                        </template> -->
                    </a-statistic>
                    <div class="right">
                        <div class="text">
                            周同比
                        </div>
                        <!-- <div class="flex"  > -->
                            <icon-arrow-down 
                                :class="{rotate: item.type}" 
                                :style="{color:`#${item.type?'25d94b':'ff5984'}`,fontSize: '20px'}" 
                                :stroke-width="6"/>
                            <div 
                                class="percentage" 
                                :style="{color:`#${item.type?'25d94b':'ff5984'}`}">
                                {{ item.percentage }}%
                            </div>
                        <!-- </div> -->
                        <!-- <div class="graphs">
                            <div 
                                v-for="(line,lineI) in graphsUp" 
                                :key="lineI" class="line" 
                                :style="[item.style,`height: ${line}%`]" />
                        </div> -->
                    </div>
                </div>
            </template>
        </template>
    </container>
</template>

<style lang="less" scoped>
.data-stat {
    width: 520px;
    height: 558px;
    .item {
        height: 120px;
        background-color: #09163A;
        width: 100%;
        margin-bottom: 10px;
        padding: 20px;
        &:last-child {
            margin-bottom: 0;
        }
        .unit {
            font-size: 18px;
        }
        .right {
            display: flex;
            align-items: flex-end;
            height: 100%;
            padding-bottom: 7px;
            & > div {
                margin-right: 10px;
            }
            .text {
                font-size: 16px;
                color: #58d0f8;
                white-space: nowrap;
            }
            .rotate {
                transform-origin: 50% 50%;
                transform: rotate(180deg);
            }
            .percentage {
                font-size: 21px;
                margin-left: 5px;
                // width: 70px;
                line-height: 21px;
            }
            // .graphs {
            //     width: 84px;
            //     height: 54px;
            //     display: flex;
            //     justify-content: space-around;
            //     align-items: flex-end;
            //     .line {
            //         width: 5px;
            //         border-radius: 10px;
            //     }
            // }
        }
    }
    :deep(.arco-statistic-title),
    :deep(.arco-statistic-value) {
        color: #39dafc;
    }
    :deep(.arco-statistic-title) {
        font-size: 20px;
        margin-bottom: 0;
        font-weight: bold;
        line-height: 20px;
    }
    :deep(.arco-statistic-value-integer) {
        font-size: 46px;
        font-weight: bold;
    }
    // :deep(.arco-statistic) {
    // }
}
</style>