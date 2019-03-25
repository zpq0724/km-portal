<template>
    <div>
		<div class="headTitle">KM后台管理系统</div>
		<div class="userInfo">
		    <Dropdown class="dropDown" placement="bottom-end" @on-click="handleClick">
		        <a href="javascript:void(0)">
		        	{{nickName}}
		            <Icon type="arrow-down-b"></Icon>
		        </a>
		        <DropdownMenu slot="list">
		            <DropdownItem>个人中心</DropdownItem>
		            <DropdownItem divided name="login">退出登录</DropdownItem>
		        </DropdownMenu>
		    </Dropdown>
		    <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg"></Avatar>
		</div>
	</div>
</template>
<script>
    export default {
        data(){
            return {
              nickName: localStorage.nickName
            }
		},
		methods: {
			handleClick (name) {
				if (name == 'login') {	//如为退出则清除cookie和localStorage
					this.cookieHandler.removeCookie('token');
					this.storageHandler.removeStorage('nickName');
					this.storageHandler.removeStorage('adminUuid');
				}
				this.$router.push({ name: name })
			}
		},
    }
</script>
<style scoped lang="less">
    .headTitle {
		font-weight: bold;
		font-size: 20px;
		margin-left:-35px;
	}
	.userInfo {
		position: absolute;
		top: 0;
		right: 50px;
		height: 60px;
		line-height: 0;
		display: flex;
		align-items: center;
	}
	.dropDown {
		float: right;
		margin-right: 10px;
	}
</style>
