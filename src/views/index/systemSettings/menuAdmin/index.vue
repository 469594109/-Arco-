<script lang="ts" setup>
import { ref, } from 'vue';
import { geAllMenuTree } from '@/api/index/systemSettings/menuAdmin';
import useLoading from '@/hooks/loading';
import { Message } from '@arco-design/web-vue';
import mainLayout from '@/components/main-layout/index.vue';
import menuContainer from './components/menu.vue';
import infoContainer from './components/info.vue';

const { loading, setLoading } = useLoading();

const menuTree = ref([]);
const menuList = ref([]);
const menuInfo = ref({}) as any;

function returnMenuList(arr: any, children: any) {
    children.forEach((v: any) => {
        v.is_leaf === '0' && arr.push({
            menu_name: v.menu_name,
            menu_id: v.menu_id,
        });
        if (v.children && v.children.length) returnMenuList(arr,v.children)
    })
    return arr;
}

async function getMenuList() {
    setLoading(!0);
    try {
        const { message } = await geAllMenuTree() as any;
        menuTree.value = message;
        // 递归取所有属于非叶子菜单
        menuList.value = returnMenuList([],menuTree.value);
    } catch (err) {
        Message.error('获取菜单失败');
    } finally {
        setLoading(!1);
    }
}

getMenuList();

function itemCLick(data: any) {
    menuInfo.value = data;
}

function upMenuData() {
    getMenuList();
    menuInfo.value.menu_id = '';
}

function addMenu() {
    menuInfo.value.menu_id = '';
    console.log(menuInfo.value);
}
</script>

<template>
    <mainLayout class="container">
        <div class="main flex">
            <div class="menu-list">
                <div class="flex_between title">
                    <div class="flex">
                        <icon-unordered-list />
                        菜单结构
                    </div>
                    <icon-plus class="push" @click="addMenu" />
                </div>
                <div class="container">
                    <a-spin :loading="loading" class="scroll-bar">
                        <menuContainer 
                            :menu-tree="menuTree"
                            @item-click="itemCLick" />
                    </a-spin>

                </div>
            </div>
            <div class="menu-info">
                <div class="flex title">
                    <icon-file />
                    菜单信息
                </div>
                <infoContainer 
                    :menu-list="menuList" 
                    :menu-info="menuInfo"
                    @up-menu="upMenuData" />
            </div>
        </div>
    </mainLayout>
</template>

<style lang="less" scoped>
.container {
    .main {
        height: 100%;
        --menu-list-width: 220px;
        
        .menu-list,
        .menu-info {
            background-color: var(--color-bg-1);
            height: 100%;
            border-radius: 6px;
            & > .title {
                margin: 0 20px;
                border-bottom: solid 1px var(--color-border-1);
                height: 50px;
                font-size: 16px;
                letter-spacing: 1px;
                color: var(--color-text-1);
            }
            
            & > .container {
                height: calc(100% - 50px);
                color: var(--color-text-2);
            }
        }
        & > .menu-list {
            width: var(--menu-list-width);
        }
        & > .menu-info {
            width: calc(100% - var(--menu-list-width) - 20px);
            margin-left: 20px;
            .container {
                overflow-y: auto;
            }
        }
    }
}
.arco-spin {
    width: 100%;
    height: 100%;
}
.arco-icon {
    font-size: 20px;
    margin-right: 7px;
}
.push {
    margin-right: 0;
    transform: translateX(10px);
    cursor: pointer;
}
</style>