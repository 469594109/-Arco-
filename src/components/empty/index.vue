<script lang="ts" setup>

defineProps({
    imgSrc: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
})

</script>

<template>
    <div class="null flex_center">
        <a-empty :img-src="imgSrc" :description="description" >
        
        </a-empty>
    </div>
</template>

<style lang="less" scoped>
.null {
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>