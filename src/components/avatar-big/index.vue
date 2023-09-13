<script lang="ts" setup>
import { debounce } from "@/assets/js/library";
import { ref, reactive, watch, computed } from 'vue';
// import defaultImg from '@/assets/images/404.png';

const props = defineProps({
    src: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    /* 用于切换色块，任意给个数值即可 */
    account: {
        type: [Number, String],
        required: !0,
    },
    size: {
        type: Number
    }
})

const showBigImg = ref(!1);

const imgUrl = ref('');

const style = reactive({
    img: {}
});

function RegExp(str: string | number | null | undefined) {
    const s = str ? String(str) : '';
    /* 去除高亮标签 */
    return s.replace(/[</?em>]/g,'');
}

const returnText = computed(()=>{
    const str = RegExp(props?.name)
        .replace(/[^\u4e00-\u9fa5\w\s]/g,'')
        .split(' ')
        .map((v:string)=>(v[0] || ''))
        .join('')
        .slice(0,2);
    return str;
})

const ColorArr = [
    'red',
    'orangered',
    'orange',
    'gold',
    'yellow',
    'lime',
    'green',
    'cyan',
    'blue',
    'arcoblue',
    'purple',
    'pinkpurple',
    'magenta',
    'gray',
]

const returnColor = computed(()=>{
    const str = ColorArr[Number(RegExp(props.account)) % 14 || 5];
    return `background-color: rgb(var(--${str}-5))`;
})

const autoPosition = (data:any) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const left = data.x;
    const top = data.y;
    const img = {} as any;
    if (left + data.target.naturalWidth > w) {
        img.right = `${w - (left - 15)  }px`;
    } else {
        img.left = `${left + 15  }px`;
    }
    if (top + data.target.naturalHeight > h) {
        img.bottom = `${h - (top + 10)  }px`;
    } else {
        img.top = `${top - 10  }px`;
    }
    style.img = img;
}
const avatarMousemove = debounce(async (e:any)=> {
    if(props.src){
        showBigImg.value = !0;
        autoPosition(e);
    };
},100);

const mouseleaveEvent = debounce(() =>{
    showBigImg.value = !1;
},200)

const avatarImgError = ()=>{
    imgUrl.value = '';
}

watch(()=>props.src,(val:string)=>{
    imgUrl.value = val;
},{immediate:!0})
</script>

<template>
    <div class="avatar-main">
        <a-avatar 
            v-if="imgUrl"
            :image-url="imgUrl"
            :size="size"
            @mousemove="avatarMousemove"
            @mouseleave='mouseleaveEvent'
            @error="avatarImgError" >
        </a-avatar>
        <a-avatar v-else-if="returnText" :size="size" :style="returnColor" >
            {{ returnText }}
        </a-avatar>
        <a-avatar v-else :size="size" :style="{ backgroundColor: 'rgb(var(--primary-6))' }">
            <IconUser />
        </a-avatar>
        <transition name="fade">
            <img
                v-if="imgUrl"
                v-show="showBigImg"
                :src="imgUrl"
                class="float-img"
                :style="style.img" >
        </transition>
    </div>
</template>

<style lang="less" scoped>
.float-img {
    position: fixed;
    z-index: 101;
    max-width: 300px;
    max-height: 300px;
}
</style>