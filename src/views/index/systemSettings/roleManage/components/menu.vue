<script lang="ts" setup>
// import { ref, reactive, computed } from 'vue';
import { ref, Ref } from 'vue';
import menuTree from './menu-tree.vue';

// const props = 
defineProps({
    list: {
        type: Array,
        default: ()=>([]),
    },
});

const selectMenu:Ref = ref([]);
// const props = defineEmits([]);;


        // 赋值选中的菜单
const setMenuData = (data:any) => {
    const dataIndex:any = selectMenu.value.findIndex((v:any) => {
        return v.menu_id === data.menu_id;
    });
    const item:any = selectMenu.value.find((v:any) => {
        return v.menu_id === data.menu_id;
    });
    if (data.is_checked_boolean && item?.menu_id !== data.menu_id) {
        selectMenu.value.push(data);
    } else if (dataIndex >= 0) {
        selectMenu.value.splice(dataIndex, 1);
    }
    // console.log(selectMenu.value);
}
defineExpose({
    selectMenu
})
</script>

<template>
    <div class="menu-box scroll-bar" >
        <menuTree :list="list" @set-menu-data="setMenuData" />
    </div>
</template>

<style lang="less" scoped>
.menu-box {
    max-height: 200px;
    overflow: auto;
}
</style>