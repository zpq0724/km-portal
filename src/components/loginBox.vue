<template>
	<transition enter-active-class="animated zoomIn">
		<!-- login-box绑定v-if,刚开始的时候盒子为false.在Mounted模板挂载之后，钩子函数中this.show变为true -->
		<div class="login-box" v-if="show">
			<div class="ivu-card">
				<div class="ivu-card-head">
					<p><i class="ivu-icon ivu-icon-log-in"></i> 欢迎登录</p>
				</div>
				<div class="ivu-card-body">
					<div class="form-con">
							<div class="phoneBox">
								<div class="adminIcon"><Icon type="md-person" slot="prepend" style="font-size: 16px"></Icon></div>
									<input
										type="text"
										class="phoneInput" 
										v-model="singInitem.phoneNumber" 
										placeholder="请输入手机号"
									/>					           
								</div>							
							<div class="phoneErrmessage">{{phoneErrmessage}}</div>
							<div class="password">
								<div class="pawIcon"><Icon type="md-lock" slot="prepend" style="font-size: 16px"></Icon></div>
									<input
										type="text"
										class="passwordInput" 
										v-model="singInitem.password" 
										placeholder="请输入密码"
										@blur="validateSignIn"
										@keyup.enter="login('singInitem')" 
									/>					           
								</div>							
							<div class="pawErrmesage">{{pawErrmesage}}</div>
					<!-- 点击登陆 -->
						<Form>
							<FormItem>
								<Button type="primary"  long  @click="login('singInitem')">登录</Button>
							</FormItem>
						</Form>
						<p class="login-tip">管理系统后台登录</p>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	import qs from 'qs'
	export default {
		data (){
			return {
				show: false,
				phoneErrmessage:"",//手机号验证信息
				pawErrmesage:"",//密码验证信息
				singInitem: {
					phoneNumber:'',
					password: ''
                },
                
			}
		},
		mounted (){
			this.show = true
		},
		methods: {
			login(name){
				this.$Loading.start()
				if(this.validateSignIn()){
					this.$axios.post('/user/login',qs.stringify(this.singInitem),
					{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
					)
					.then((res)=>{
						if(res.data.code == 2000){
							this.cookieHandler.setCookie('token',res.data.token); //设置token
							this.storageHandler.setStorage('nickName',res.data.data.user.nickName);
							this.storageHandler.setStorage('adminUuid',res.data.data.user.uuid);
							this.$Loading.finish();
							this.$Message.success('登录成功');
							this.$router.push({
								name:'main'
							})
						} else {
							this.$Message.error('账号，密码错误');
							this.$Loading.error()
						}
					})
				}
			},
			//登陆前验证手机号
			validateSignIn(){
				let result = true;
				let phoneNumber = this.singInitem.phoneNumber;
				let password = this.singInitem.password;
				let phoneNumberReg = /^1[34578]\d{9}$/;
				let passwordReg = /^.{6,18}$/;
				if(phoneNumber == ""){
					this.phoneErrmessage = "手机号不能为空"
					return;
				}else if(!phoneNumberReg.test(phoneNumber)){
					this.phoneErrmessage = "手机号格式错误";
					 result = false;
					return;
				}else{
					this.phoneErrmessage="";
					result = true;
				}
				if(!passwordReg.test(password)){
					this.pawErrmesage ="密码长度不能少于六位";
					 result = false;
					return;
				}else{
					this.pawErrmesage ="";
				}
				return result;
			}
		}
	}
</script>

<style scoped>
	.login-box {
		position: absolute;
		right: 160px;
		top: 50%;
		margin-top: -140px;
		width: 300px;
	}
	.phoneBox,.password{
		display:flex;
		width:268px;
		height:33px;
		margin-bottom:15px;}
	.adminIcon,.pawIcon{
		width:30px;
		height: 33px;
		padding:8px 7px;    
		line-height: 1;
		color: #515a6e;
		text-align: center;
		background-color: #f8f8f9;
		border: 1px solid #dcdee2;
		border-radius: 4px 0 0 4px;}
	.phoneInput,.passwordInput{
		padding:4px 7px;
		width:237px;
		font-size: 14px;
		color:#444444;
		border:none;   
		border: 1px solid #dcdee2;
    	border-radius: 0 4px 4px 0;
	
    }
	.phoneErrmessage,.pawErrmesage{
		font-size: 12px;
		color: red;
		margin-bottom: 12px;
	
	}
	.form-con {
		padding-top: 10px;
	}
	.login-tip {
	    font-size: 10px;
		text-align: center;
		color: #c3c3c3;
	}
	
</style>
