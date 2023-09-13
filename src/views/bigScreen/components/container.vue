<script lang="ts" setup>
// import { ref, reactive, computed } from 'vue';

// const props = defineProps({});
defineProps({
    title: {
        type: String,
        default: ''
    },
});
// const props = defineEmits([]);;

</script>

<template>
    <div class="container-box" >
        <div class="border-top" />
        <div class="content-box flex">
            <!-- <div class="border-left" /> -->
            <div class="content">
                <div class="title-box">
                    <div class="title flex">
                        <!-- <slot name="title">
                        </slot> -->
                            {{ title }}
                    </div>
                </div>
                <div class="main">
                    <slot name="main">
                    <!-- <slot > -->
                    </slot>
                </div>
            </div>
            <div class="border-right" />
        </div>
        <div class="border-bottom" />
    </div>
</template>

<style lang="less" scoped>
.container-box {
    .border- {
        &top, 
        &bottom {
            height: 2px;
        }
        &top {
            background-image: linear-gradient(to right,rgba(#1AC9FF,0),rgba(#1AC9FF,0.4));
        }
        &bottom {
            background-image: linear-gradient(to right,#1AC9FF,#1DC2FB);
        }

        &left, 
        &right {
            width: 2px;
            height: 100%;
        }
        &left {
            background-image: linear-gradient(to bottom,rgba(#1AC9FF,0),rgba(#1AC9FF,1));
        }
        &right {
            background-image: linear-gradient(to bottom,rgba(#1AC9FF,0.4),rgba(#1DC2FB,1));
        }
    }
    .content-box {
        height: calc(100% - 4px);
        .content {
            width: calc(100% - 2px);
            height: 100%;
            .title-box {
                position: relative;
                border-bottom: 2px solid ;
                border-image: linear-gradient(to right, #1AC9FF, rgba(26,201,255,0)) 1;
                height: 40px;
                .title {
                    padding: 0 35px;
                    width: 60%;
                    height: 100%;
                    line-height: 16px;
                    font-size: 16px;
                    font-weight: bold;
                    background-image: linear-gradient(to left,rgba(#1AC9FF,0),rgba(#1AC9FF,0.5));
                }
                &::before,
                &::after {
                    content: '';
                    display: block;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                }
                &::before {
                    background-image: url('@/assets/images/bigScreen/title-left.png');
                    left: 20px;
                    width: 6px;
                    height: 16px;
                }
                &::after {
                    background-image: url('@/assets/images/bigScreen/title-right.png');
                    right: 20px;
                    width: 50px;
                    height: 14px;
                }
            }
            .main {
                height: calc(100% - 40px);
                position: relative;
                // width: 100%;
                border-left: 2px solid ;
                border-image: linear-gradient(to bottom,rgba(#1AC9FF,0), rgba(#1AC9FF,1)) 1;
                &::after {
                    content: '';
                    display: block;
                    position: absolute;
                    background-image: url('@/assets/images/bigScreen/triangle.png');
                    right: 3px;
                    bottom: 3px;
                    width: 22px;
	                height: 22px;
                }
                // height: ;
            }
        }
    }
}
</style>