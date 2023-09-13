<script lang="ts" setup>
import { computed } from 'vue';
import dayjs from 'dayjs';
// import dataStatistics from './components/dataStatistics.vue';
// import hotspotRanking from './components/hotspotRanking.vue';
// import chartMap from './components/chartMap.vue';
// import chartPie from './components/chartPie.vue';
// import chartLine from './components/chartLine.vue';
// import chartWord from './components/chartWord.vue';

const today = computed(()=>{
    const day = ['天','一','二','三','四','五','六']
    return `${dayjs().format('YYYY年M月D日')} 星期${day[dayjs().day()]}`;
})
</script>

<template>
    <div class="big-screen scroll-bar">
        <div class="head">
            <div class="time">
                {{ today }}
            </div>
        </div>
        <div class="content">
            <!-- <div class="top flex">
                <dataStatistics />
                <chartMap />
                <hotspotRanking />
            </div>
            <div class="bottom flex">
                <chartPie />
                <chartLine />
                <chartWord />
            </div> -->
            
        </div>
    </div>
</template>

<style lang="less" scoped>
.big-screen {
    overflow: auto;
    min-width: 1920px;
    background-color: #000B25;
    color: var(--color-white);
    height: 100%;
    .head {
        background: #06123A url('@/assets/images/bigScreen/top.png') no-repeat center;
        height: 96px;
        .time {
            font-size: 18px;
            line-height: 18px;
            height: 100%;
            text-align: right;
            padding-top: 28px;
            font-weight: bold;
            padding-right: 20px;
            background: -webkit-linear-gradient(bottom , #68A5EC,#3DD5FB);
            -webkit-text-fill-color: transparent;
            background-clip: text;
            -webkit-background-clip: text;
            font-family: 'SY_HT';
        }
    }
    .content {
        padding: 10px 20px 20px;
        font-family: 'MicrosoftYaHei';
        // font-family: 'SY_HT';
        height: calc(100% - 96px);
        .top {
            & > div {
                margin-bottom: 15px;
            }
        }
        .bottom {
            min-height: 238px;
            height: calc(100% - 573px);
        }
        :deep(.arco-card-bordered) {
            border: none;
        }
    }
}

html::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
</style>