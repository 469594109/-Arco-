<script lang="ts" setup>
import { ref, Ref } from 'vue';
import { hotspotList } from '@/api/bigScreen';
import container from './container.vue';

// const props = defineProps({});
// const props = defineEmits([]);;

const list:Ref = ref([]);

const getHotspotList = async ()=>{
    const { message } : any = await hotspotList();
    list.value = message;
}
getHotspotList();

</script>

<template>
    <container title="热点排名" class="hotspot" >
        <template #main>
            <div 
                v-for="(item,index) in list" 
                :key="index"
                :class="['item flex_between',`item${index + 1}`]">
                <div class="left flex">
                    <div class="index flex_center">
                        {{ index + 1 }}
                    </div>
                    <div class="data ellipsis">
                        {{ item.title }}
                    </div>
                </div>
                <div class="num">
                    {{ item.heat }}
                </div>
            </div>
        </template>
    </container>
</template>

<style lang="less" scoped>
.hotspot {
    width: 470px;
    height: 558px;
    .item {
        padding: 10px 10px;
        margin-bottom: 5px;
        &:last-child {
            margin-bottom: 0;
        }
        .left {
            max-width: calc(100% - 35px);
        }
        .index {
            width: 26px;
	        height: 26px;
            background-color: #05274c;
            border-radius: 20px;
            margin-right: 10px;
            font-size: 12px;
            line-height: 12px;
        }
        .data {
            max-width: calc(100% - 36px);
            padding-right: 10px;
        }
        .num {
            color: #31fdff;
        }
        &1 .index {
            background-color: #ff5252;
        }
        &2 .index {
            background-color: #ff9c43;
        }
        &3 .index {
            background-color: #189aff;
        }
    }
}
</style>