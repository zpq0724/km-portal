<template>
    <div>
      <Spin v-show="showInfoLoading" class="loading">
			<Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
			<div class="tip">加载中...</div>
	  </Spin>
    </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
    export default {
        data(){
            return{
               
            }
        },
        computed:{
            ...mapState([
                'showInfoLoading'
            ])
        },
    }
</script>

<style scoped>
.ivu-layout-content{
   position: relative;
 }
.loading {
    position: absolute;
    left:50%;
    top:50%;   
    }
.demo-spin-icon-load{
	animation: ani-demo-spin 1s linear infinite;
}
.tip {
margin-top: 3px;
}
.ivu-spin {
    color: #999;
}
</style>
