<template>
	<div>
		<div v-for="(item,index) in question" :key="index">
			<P style="margin-top:10px">{{item.showOrder}}.{{item.title}}</P>
			<RadioGroup v-if="item.type == 0" class="mt10">
                <Radio v-for="elem in item.optionContent" :key="elem.uid" label="elem.uid">{{elem}}</Radio>
            </RadioGroup>
            <CheckboxGroup v-if="item.type == 1" class="mt10">
            	<Checkbox v-for="elem in item.optionContent" :key="elem.uid" :label="elem.uid">{{elem}}</Checkbox>
            </CheckboxGroup>
			<!-- 填空题 -->
            <Input v-if="item.type == 2" type="textarea" :autosize="{minRows: 1,maxRows: 3}" class="mt10"></Input>
			<!-- 评分题 -->
			<div  v-if="item.type == 3">
				&nbsp;&nbsp;&nbsp;&nbsp;最小评级：<input type="text" style="padding-left:10px;" v-model="item.minDescription"></br>
				&nbsp;&nbsp;&nbsp;&nbsp;最大评级：<input  type="text" style="padding-left:10px;" v-model="item.maxDescription">
			</div>
			<!-- 日期 -->
			<p  v-if="item.type == 4">
				 <Date-picker type="date" placeholder="选择日期" style="width: 200px"></Date-picker>
			</p>
			<!-- 性别 -->
			<p v-if="item.type == 5">
				<input type="radio" name="sex" style="margin: 10px 0 0 15px;" id="man" value="男" />
                <label for="man">男</label>
                <input type="radio" name="sex" style="margin: 10px 0 0 15px;" id="woman" value="女" />
                <label for="woman">女</label>
			</p>			
		</div>
		<loading/>
	</div>
</template>

<script>
	import loading from "../components/loading"
	export default {
		data () {
			return {
				templetId:"",
				question: [],
			}
		},
		created(){
			var gettempletId = Number(this.$route.query.templetId)
			this.templetId = gettempletId;
			this.$store.commit('SHOW_LOADING') //触发方法
			this.$axios.get('templet/info/{id}?templetId='+gettempletId).then((res)=>{
				//console.log(res)
			this.question = res.data.data.templetDtos;
			this.$store.commit('HIDE_LOADING')
			})
		
		},
		components:{
			loading  //注册loading
		}
	}
</script>

<style scoped>
	.mt10 {
		margin-top: 10px;
		margin-bottom: 10px;
	}
</style>