<template>
  <div>
    <div>
      <p>用户uuid：{{userInfo.uuid}}</p>
      <p>昵称：{{userInfo.nickName}}</p>
      <p>用户手机号：{{userInfo.phoneNumber}}</p>
      <p>标题：{{userInfo.title}}</p>
      <p>积分：{{userInfo.pointNumber}}</p>
      <p>网址：{{userInfo.officialUrl}}</p>
      <p><span>用户头像：</span>
        <img :src="userInfo.headImageUrl">
      </p>
      <p>
          <span>商品标志：</span>
          <img :src="userInfo.logoImageUrl">
      </p>
      <p>
          <span>背景图片：</span>
          <img :src="userInfo.backgroundImageUrl">
      </p>
    </div>
    <!-- loading -->
      <Spin v-if="showInfoLoading" class="loading">
						<Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
						<div class="tip">加载中...</div>
			</Spin>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {},
      showInfoLoading:false
    };
  },
  created() {
    var getuuid = this.$route.query.uuid;
    this.showInfoLoading = true;
    this.$axios.get("user/info?uuid=" + getuuid).then(res => {
      this.userInfo = res.data.data.data;
      this.showInfoLoading = false;
    });
  }
};
</script>

<style scoped>
p{
    margin:0 0 10px 10px;
}
img{
    width:100px;
    height:100px;
    }
span{
    float:left;
    }
 .ivu-card-body{
   position: absolute;
 }
.loading {
		width: 100%;
    position: relative;
    top:-350px;
    }
.demo-spin-icon-load{
	animation: ani-demo-spin 1s linear infinite;
  color: #999;
}
.tip {
		color: #999;
		margin-top: 3px;
		}
		
</style>