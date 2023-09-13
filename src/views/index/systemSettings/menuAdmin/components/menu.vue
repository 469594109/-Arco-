<script lang="tsx">
import { defineComponent, ref, h, compile, computed } from 'vue';

export default defineComponent({
    props: {
        menuTree: {
            type: Array,
        }
    },
    emits: ['itemClick'],
    setup(props,content) {
        const menuTree = computed(()=>{
            return props.menuTree;
        }) as any

        const openKeys = ref<string[]>([]);
        const selectedKey = ref<string[]>([]);

        const goto = (item: any,event:any) => {
            event.stopPropagation();
            content.emit('itemClick',item);
        };

        const renderSubMenu = () => {
            function travel(_route: any[], nodes = []) {
                if (_route) {
                    _route.forEach((element) => {
                        const icon = element?.icon_name
                            ? () => h(compile(`<${element?.icon_name}/>`))
                            : null;
                        const node =
                            element?.children && element?.children.length !== 0 ? (
                            <a-sub-menu
                                key={element?.menu_name}
                                v-slots={{
                                    icon,
                                    title: () => h(compile(element?.menu_name || '')),
                                }}
                                onClick={(e:any) => element?.is_leaf === '0' && goto(element,e)}
                            >
                                {travel(element?.children)}
                            </a-sub-menu>
                            ) : (
                            <a-menu-item
                                key={element?.menu_name}
                                v-slots={{ icon }}
                                onClick={(e:any) => goto(element,e)}
                            >
                                {element?.menu_name || ''}
                            </a-menu-item>
                            );
                        nodes.push(node as never);
                    });
                }
                return nodes;
            }
            return travel(menuTree.value);
        };

        return () => (
            <a-menu
                v-model:open-keys={openKeys.value}
                selected-keys={selectedKey.value}
                auto-open-selected={true}
                level-indent={34}
                style="height: 100%;"
                >
                {renderSubMenu()}
            </a-menu>
        );
    },
});
</script>

<style lang="less" scoped>
:deep(.arco-menu-inner) {
    &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: rgba(218, 218, 218, 0.7);
    }
    &::-webkit-scrollbar-thumb:hover {
        background-color: rgba(218, 218, 218, 1);
    }
    .arco-menu-inline-header {
        display: flex;
        align-items: center;
    }
    .arco-icon {
        &:not(.arco-icon-down) {
            font-size: 18px;
        }
    }
}
</style>