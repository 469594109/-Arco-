<script lang="ts" setup>
import { reactive, ref, Ref, watch } from 'vue';

const props = defineProps({
    list: {
        type: Array,
        default: ()=>([]),
    },
    left: {
        type: [Number,String],
        default: 0,
    }
});
const emit = defineEmits(['setMenuData','toggleParentMenu']);

const itemRefs:any = reactive({});
const setItemRef = (el:any,key:string)=>{
    if(el) itemRefs[key] = el;
};


const menuList: Ref = ref([]);


const setMenuData = (data:any)=> {
    emit("setMenuData", data);
};

// 选择子菜单
const findChildMenu = (data:any)=> {
    data.forEach((v:any) => {
        // v.show = v.menu_id === data.menu_id;
        if (!v.show) {
            const obj = itemRefs[v.menu_id];
            if (obj) {
                obj.menuList.forEach((v1:any)=>{
                    v1.show = false;
                })
            }
        }
    });
    // if (data.children.length > 0) {
        // findChildMenu();
    // }
}
// 切换菜单
const switchMenu = (data:any)=> {
    menuList.value.forEach((v:any) => {
        v.show = v.menu_id === data.menu_id;
    });
    // if (data.children.length > 0) {
        // findChildMenu(menuList.value);
    // }
}

// 选中子菜单
const selectChildMenu = (obj:any, state:boolean)=>{
    obj.menuList.forEach((v:any)=>{
        v.is_checked_boolean = state;
        emit("setMenuData", v);
    })
}

// 反选菜单
const toggleMenu = (data: any)=> {
    data.is_checked_boolean = !data.is_checked_boolean;
    if (itemRefs[data.menu_id]) {   
        selectChildMenu(itemRefs[data.menu_id],data.is_checked_boolean);
    }
    emit("toggleParentMenu", menuList.value)
    emit("setMenuData", data);
}

// 反选父标签
const toggleParentMenu = (arr:any)=> {
    const state = arr.every((index:any) => index.is_checked_boolean);
    const parenId = arr[0].menu_parent;
    const data = menuList.value.find((index:any) => index.menu_id === parenId);
    data.is_checked_boolean = state;
    emit("setMenuData", data);
}

watch(()=>props.list,(val: any)=>{
    menuList.value = JSON.parse(JSON.stringify(val)).map((v:any)=>{
        if (v.is_checked_boolean) {
            emit('setMenuData',v);
        }
        v.show = false;
        return v;
    });
},{deep:!0,immediate:!0});

defineExpose({
    menuList,
    selectChildMenu,
    findChildMenu,

})

</script>

<template>
    <div class="ul" >
        <div 
            v-for="item in menuList" 
            :key="item.menu_id" 
            class="li"
            :class="{on: item.show,leaf: Number(item.is_leaf)}"
            @click.stop="switchMenu(item)">
            <div 
                class="top flex" 
                :style="{paddingLeft: `${left}px`}"
                >
                <a-checkbox 
                    :model-value="item.is_checked_boolean"
                    @click.stop="toggleMenu(item)" />
                <icon-drive-file v-show="Number(item.is_leaf)"/>
                <icon-folder-delete v-show="!Number(item.is_leaf)"/>
                {{ item.menu_name }}
                <!-- <div class="menu_name">
                </div> -->
            </div>
            <!-- {{ item.children }} -->
            <menu-tree 
                v-if='item.is_leaf === "0"'
                v-show='item.show'
                :ref='(el:any)=>setItemRef(el,item.menu_id)'
                :list="item.children"
                :left='20+Number(left)'
                @set-menu-data='setMenuData'
                @toggle-parent-menu='toggleParentMenu' />
        </div>
    </div>
</template>

<style lang="less" scoped>
.ul {
    .li {
        cursor: pointer;
        &.on {
            background-color: var(--color-fill-1);
        }
        .top {
            padding: 4px 5px;
            &:hover {
                background-color: var(--color-fill-2);
            }
        }
        
        .arco-icon {
            margin: 0 5px;
            font-size: 18px;
            color: var(--color-text-2);
        }
        // .menu_name {
        // }
    }
}
</style>