<script lang="ts" setup>
import { ref, watch, computed, } from 'vue';
import useLoading from '@/hooks/loading';
import { submitEditMenu, delMenu } from '@/api/index/systemSettings/menuAdmin';
import { Message } from '@arco-design/web-vue';
import { ValidatedError } from '@arco-design/web-vue/es/form/interface';

const props = defineProps({
    /* 根目录节点 */
    menuList: {
        type: Array,
    } as any,
    /* 根目录节点 */
    menuInfo: {
        type: Object,
    } as any,
})
const emit = defineEmits(['upMenu']);

const { loading, setLoading } = useLoading();


const type = computed(()=>{
    return !!props.menuInfo.menu_id;
});
const addForm = ref();

function resetFrom () {
    return {
        menu_name: "",
        menu_url: "",
        menu_rank: "",
        menu_desc: "",
        menu_parent: "",
        is_valid: '0',
        is_show_dialog: '0',
        is_leaf: '0',
        icon_name: '',
    }
}

const form = ref(resetFrom());

const formList = ref([]) as any;

function initFormList(){
    formList.value = [
        {
            label: '菜单名称：',
            key: 'menu_name',
            placeholder: '请输入菜单名称',
            rules: [{ required: true, message: '请输入菜单名称后提交'}],
            type: 1,
        },
        {
            label: '父菜单节点：',
            key: 'menu_parent',
            placeholder: '请选择父菜单节点',
            rules: [{ required: true, message: '请选择父菜单节点后提交'}],
            type: 3,
            options: [],
        },
        {
            label: '是否启用：',
            key: 'is_valid',
            placeholder: '',
            type: 2,
            options: [],
        },
        {
            label: '是否dialog展示页面：',
            key: 'is_show_dialog',
            placeholder: '',
            type: 2,
            options: [],
        },
        {
            label: '是否为叶子节点：',
            key: 'is_leaf',
            placeholder: '',
            type: 2,
            options: [],
        },
        {
            label: '菜单顺序：',
            key: 'menu_rank',
            placeholder: '请输入菜单顺序',
            type: 1,
        },
        {
            label: '菜单路径：',
            key: 'menu_url',
            placeholder: '请输入菜单路径',
            rules: [{ required: true, message: '请输入菜单路径后提交'}],
            type: 1,
        },
        {
            label: '菜单图标：',
            placeholder: '请输入icon名称，如：icon-close',
            key: 'icon_name',
            type: 1,
        },
        {
            label: '菜单描述：',
            key: 'menu_desc',
            placeholder: '请输入菜单描述',
            type: 4,
        },
    ]
}

initFormList();

async function submit({errors,values}:{
  errors: Record<string, ValidatedError> | undefined;
  values: any;
}) {
    setLoading(!0);
    try {
        if(errors) throw Error();
        const data = values;
        if (type.value) data.menu_id = props.menuInfo.menu_id;
        const { message } = await submitEditMenu(type.value,data) as any;
        Message.success(message);
        emit('upMenu');
        addForm.value.resetFields();
    } catch (err) {
        Message.error(`${type.value ? '修改' : '保存'}菜单失败`);
    } finally {
        setLoading(!1);
    }
}

async function deleteMenu() {
    setLoading(!0);
    try {
        const { message } = await delMenu(props.menuInfo?.menu_id) as any;
        Message.success(message);
        emit('upMenu');
        addForm.value.resetFields();
    } catch (err) {
        Message.error(`删除菜单失败`);
    } finally {
        setLoading(!1);
    }
}

watch(()=>props.menuList,(val)=>{
    if(val && val.length){
        formList.value[1].options = val;
    }
},{deep:!0});
watch(()=>props.menuInfo,(val)=>{
    if(val){
        for(const i in form.value) {
            if(val[i]) form.value[i] = val[i];
        }
    }
},{deep:!0});
</script>

<template>
    <div class="container scroll-bar">
        <a-form
            ref="addForm"
            :model="form"
            class="form"
            layout="horizontal"
            @submit="submit" >
            <template v-for="item in formList" :key="item">
                <a-form-item 
                    :field="item.key"
                    :rules="item.rules"
                    :label="item.label" 
                    label-col-flex="150px">
                    <template v-if="item.type === 1">
                        <a-input 
                            v-model="form[item.key]"
                            :placeholder="item.placeholder" />
                    </template>
                    <template v-else-if="item.type === 2">
                        <a-radio-group 
                            v-model="form[item.key]">
                            <a-radio value="1">是</a-radio>
                            <a-radio value="0">否</a-radio>
                        </a-radio-group>
                    </template>
                    <template v-else-if="item.type === 3">
                        <a-select 
                            v-model="form[item.key]" 
                            :placeholder="item.placeholder">
                            <a-option :value="-1" label="根节点" />
                            <a-option 
                                v-for="parent in item.options" 
                                :key="parent.menu_id" 
                                :value="parent.menu_id"
                                :label="parent.menu_name" />
                        </a-select>
                    </template>
                    <template v-else-if="item.type === 4">
                        <a-textarea 
                            v-model="form[item.key]" 
                            :placeholder="item.placeholder"
                            style="min-height: 60px"
                            allow-clear/>
                    </template>
                    <!-- <template v-else-if="item.type === 5">
                        <icon-file-image
                            title="选择图片"
                            @click.stop='openIconContainer' /> -->
                </a-form-item>
            </template>
            <div class="flex_around footer">
                <a-button 
                    class="btn submit"
                    type="primary"
                    :loading="loading"
                    html-type="submit">
                    {{ type ? '修改' : '保存' }}
                </a-button>
                <a-button 
                    v-show="type"
                    class="btn"
                    type="secondary" 
                    status="danger"
                    :loading="loading"
                    @click="deleteMenu">
                    删除
                </a-button>
            </div>
        </a-form>
    </div>
</template>

<style lang="less" scoped>
.container {
    padding: 30px 0;
    .form {
        width: 500px;
        margin: 0 auto;
        .footer {
            margin: 10px auto 0;
            width: 215px;
        }
    }
    & > div {
        width: 495px;
        margin: 0 auto 25px auto;
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: flex-start;
        & > .name {
            height: 32px;
            width: 145px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
        & > .ipt {
            width: calc(100% - 145px);
            input {
                width: 100%;
                height: 32px;
                padding: 0 5px;
                border-radius: 4px;
                border: solid 1px #cccccc;
            }
        }
        & > .icon {
            min-height: 32px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            img {
                cursor: pointer;
            }
        }
        & > .memo {
            width: calc(100% - 145px);
            textarea {
                width: 100%;
                max-width: 100%;
                height: 100px;
                padding: 5px;
                border-radius: 4px;
                border: solid 1px #cccccc;
            }
        }
        & > .select {
            width: calc(100% - 145px);
            position: relative;
            select {
                width: 100%;
                height: 32px;
                border-radius: 4px;
                border: solid 1px #cccccc;
                padding-left: 5px;
                padding-right: 30px;
                appearance: none;
            }
            img {
                position: absolute;
                pointer-events: none;
                right: 10px;
                top: 12px;
            }
        }
        & > .radio {
            ul {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                height: 32px;
                li {
                    a {
                        padding-left: 20px;
                        background-color: transparent;
                        background-image: url("../assets/images/menu/radio.png");
                        background-position: center left;
                        background-repeat: no-repeat;
                        &.on {
                            background-image: url("../assets/images/menu/on-radio.png");
                        }
                    }
                    &:first-child {
                        margin-right: 25px;
                    }
                }
            }
        }
    }
    & > .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        a {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 70px;
            height: 32px;
            border-radius: 4px;
            color: #fff;
            &.add,
            &.edit {
                background-color: #00939a;
                position: relative;
                div {
                    position: absolute;
                    z-index: 1;
                    cursor: context-menu;
                    &::after {
                        content: "";
                        position: absolute;
                        width: 18px;
                        height: 18px;
                        border: 4px solid #fff;
                        border-left-color: transparent;
                        top: calc(50% - 9px);
                        left: calc(50% - 9px);
                    }
                }
            }
            &.remove {
                background-color: #f25151;
                margin-left: 30px;
            }
        }
    }
    .arco-icon {
        font-size: 20px;
        margin-right: 7px;
        color: rgb(var(--primary-6));
        cursor: pointer;
    }
}
</style>