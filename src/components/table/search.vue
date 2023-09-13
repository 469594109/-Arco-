<script lang="ts" setup>
import { ref, } from 'vue';


defineProps({
    /* 以下为查询部分使用参数 */
    // 搜索界面的渲染，如几个input框，几个时间选择器等
    searchList: {
        type: Array,
        default:()=>[],
    /* 
    {
        label: '前缀名',
        type: 1, // 1 input 2 select 3 时间选择器
        placeholder: '请输入手机号', // 占位符内容
        key: 'phone', // key名
        options: [
            {
                label: '我爱你', // 选择框展示内容,
                value: 520, // value值
            }
        ],
        span: 6,// 容器宽 24栅格百分比 默认6
        offset: 0,// 左侧栅格间距 默认0
        xxl: // 各种宽度栅格
        xl: // 各种宽度栅格
        lg: // 各种宽度栅格
        md: // 各种宽度栅格
        sm: // 各种宽度栅格
    },
     */
    },
})
const emit = defineEmits(['searchClick','resetSearch']);


/* 以下为查询部分使用参数 start */

/* 用户与初始form数据 */
const generateFormModel = () => {
    return {};
};

const formModel = ref(generateFormModel());

/* 搜索按钮点击事件 */
const search = () => {
    emit('searchClick',formModel);
};

/* 重置按钮点击事件 */
const reset = () => {
    formModel.value = generateFormModel();
    emit('resetSearch',formModel);

};
/* 以下为查询部分使用参数 end */

// 导出实例的方法与变量
defineExpose({
    /* 以下为搜索部分导出 */
    formModel,
})
</script>

<template>
    <div class="table-search-main">
        <a-card class="general-card" title="查询表格">
            <a-row>
                <a-col :flex="1">
                    <a-form
                        :model="formModel"
                        :label-col-props="{ span: 6 }"
                        :wrapper-col-props="{ span: 18 }"
                        label-align="left" >
                        <a-row :gutter="16">
                            <template v-for="(item,index) in (searchList as any)" :key="index">
                                <a-col 
                                    :span="item.span || 8" 
                                    :offset="item.offset || 0" 
                                    :xxl="item.xxl || 6"
                                    :xl="item.xl || 8"
                                    :lg="item.lg || 9"
                                    :md="item.md || 12"
                                    :sm="item.sm || 14"
                                     >
                                    <a-form-item
                                        :field="item.key"
                                        :label="item.label" >
                                        <a-input
                                            v-if="item.type === 1"
                                            v-model="formModel[item.key]"
                                            :placeholder="item.placeholder"
                                            :allow-clear="item.allowClear" />

                                        <a-select
                                            v-if="item.type === 2"
                                            v-model="formModel[item.key]"
                                            :options="item.options"
                                            :placeholder="item.placeholder" />
                                        <a-range-picker
                                            v-if="item.type === 3"
                                            v-model="formModel[item.key]"
                                            style="width: 100%" />
                                    </a-form-item>
                                </a-col>

                            </template>
                            
                            <!-- <a-col 
                                :span="8" 
                                :offset="0" 
                                :xxl="6"
                                :xl="8"
                                :lg="10"
                                :md="12"> -->
                                <a-space :size="18" style="padding-left: 8px;">
                                    <a-button html-type="submit" type="primary" @click="search">
                                    <template #icon>
                                        <icon-search />
                                    </template>
                                    {{ $t('searchTable.form.search') }}
                                    </a-button>
                                    <a-button @click="reset">
                                    <template #icon>
                                        <icon-refresh />
                                    </template>
                                    {{ $t('searchTable.form.reset') }}
                                    </a-button>
                                    <slot name="searchBtns">  

                                    </slot>
                                </a-space>
                            <!-- </a-col> -->
                        </a-row>
                    </a-form>
                </a-col>
            </a-row>
            <a-divider  style="margin-top: 0"/>
            <a-row v-if="false" style="margin-bottom: 10px">
                <slot name="btnS">  

                </slot>
            </a-row>
            <!-- 以下内容待修改 -->
            <a-row v-if="false" style="margin-bottom: 16px">
                <a-col :span="12">
                    <a-space>
                        <a-button type="primary">
                            <template #icon>
                                <icon-plus />
                            </template>
                            {{ $t('searchTable.operation.create') }}
                        </a-button>
                        <a-upload action="/">
                            <template #upload-button>
                                <a-button>
                                {{ $t('searchTable.operation.import') }}
                                </a-button>
                            </template>
                        </a-upload>
                    </a-space>
                </a-col>
                <a-col
                :span="12"
                style="display: flex; align-items: center; justify-content: end"
                >
                <a-button>
                    <template #icon>
                    <icon-download />
                    </template>
                    {{ $t('searchTable.operation.download') }}
                </a-button>
                <a-tooltip :content="$t('searchTable.actions.refresh')">
                    <div class="action-icon" @click="search"
                    ><icon-refresh size="18"
                    /></div>
                </a-tooltip>
                <!-- <a-dropdown @select="handleSelectDensity">
                    <a-tooltip :content="$t('searchTable.actions.density')">
                    <div class="action-icon"><icon-line-height size="18" /></div>
                    </a-tooltip>
                    <template #content>
                    <a-doption
                        v-for="item in densityList"
                        :key="item.value"
                        :value="item.value"
                        :class="{ active: item.value === size }"
                    >
                        <span>{{ item.name }}</span>
                    </a-doption>
                    </template>
                </a-dropdown> -->
                <!-- <a-tooltip :content="$t('searchTable.actions.columnSetting')">
                    <a-popover
                    trigger="click"
                    position="bl"
                    @popup-visible-change="popupVisibleChange"
                    >
                    <div class="action-icon"><icon-settings size="18" /></div>
                    <template #content>
                        <div id="tableSetting">
                        <div
                            v-for="(item, index) in showColumns"
                            :key="item.dataIndex"
                            class="setting"
                        >
                            <div style="margin-right: 4px; cursor: move">
                            <icon-drag-arrow />
                            </div>
                            <div>
                            <a-checkbox
                                v-model="item.checked"
                                @change="handleChange($event, item as TableColumnData, index)"
                            >
                            </a-checkbox>
                            </div>
                            <div class="title">
                            {{ item.title === '#' ? '序列号' : item.title }}
                            </div>
                        </div>
                        </div>
                    </template>
                    </a-popover>
                </a-tooltip> -->
                </a-col>
            </a-row>
        </a-card>
    </div>
</template>

<style lang="less" scoped>
.table-search-main {
    height: 100%;
    :deep(.arco-card-header-title) {
        height: 25px;
    }
    :deep(.arco-card) {
        height: 100%;
    }
    :deep(.arco-card-body) {
        height: calc(100% - 65px);
    }
    .action-icon {
        margin-left: 12px;
        cursor: pointer;
    }
    .active {
        color: #0960bd;
        background-color: #e3f4fc;
    }
    .setting {
        display: flex;
        align-items: center;
        width: 200px;
        .title {
            margin-left: 12px;
            cursor: pointer;
        }
    }
}
:deep(.arco-table-th) {
    &:last-child {
        .arco-table-th-item-title {
            margin-left: 16px;
        }
    }
}
</style>