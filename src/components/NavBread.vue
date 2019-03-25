<template>
	<div>
        <Breadcrumb :style="{margin: '16px 0'}">
            <BreadcrumbItem to="/home">首页</BreadcrumbItem>
            <BreadcrumbItem 
            v-for="(item, index) in breadRouterList" 
            :key="index" 
            :to="item.path">
                {{item.name}}
            </BreadcrumbItem>
        </Breadcrumb>
    </div>
</template>

<script>
    import { selectTitleFromList } from '@/utils/path'
	export default {
        data() {
            return {
                breadRouterList: [], // 面包屑对应的路由集合
            }
        },
        methods: {
            // 路由变化时，计算面包屑所对应路由的数据
            calPath() {
                let matched = this.$route.matched;
                if(matched[1].name =='home'){
                    this.breadRouterList = [];
                }else{
                    let pathListArr = [];
                    for(let i = 0; i < matched.length; i ++){
                        let obj = {};
                        obj.name = selectTitleFromList(matched[i].name);
                        obj.path = matched[i].path;
                        pathListArr.push(obj);
                    }
                    this.breadRouterList = pathListArr;
                }
            },
        },
        watch: {
            // 监听路由变化
            $route() {
                this.calPath();
            }
        }
	}
</script>

<style scoped lang="less">
	
</style>
