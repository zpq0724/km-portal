<template>
	<div class="login">
		<loginBox></loginBox>
		
	</div>
</template>

<script>
	 import LoginBox from '../components/LoginBox'
	export default {
		name: 'login',
		components: {
			LoginBox
		},
		created () {
			//如果是移动端则跳转到移动端登录页
			// if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
			// 	this.$router.push({name: 'login_mobile'});
			// }
		}
	}
</script>

<style>
	html,body {
		height: 100%;
	}
	.login {
	    width: 100%;
	    height: 100%;
	    background-image: url(https://file.iviewui.com/iview-admin/login_bg.jpg);
	    background-size: cover;
	    background-position: center;
		position: relative;	
	}
</style>