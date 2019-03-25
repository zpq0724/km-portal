<template>
	<div>
		<p style="margin:0 0 10px 18px;font-size:16px;">问卷标题：{{title}}</p>
		<p  style="margin:0 0 10px 18px;font-size:14px;">问卷描述：{{description}}</p>
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
			<div v-if="item.type == 3">
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
	import loading from "../components/loading";
	export default {
		data () {
			return {
				questionnaireId:"",
				question: [],
				title:"",
				description:"",
			}
		},
		created(){
			var getquestionnaireId = Number(this.$route.query.questionnaireId)
			this.questionnaireId = getquestionnaireId;
			this.$store.commit('SHOW_LOADING')
			this.$axios.get('survey/questionnaire/{id}?questionnaireId='+this.questionnaireId).then((res)=>{
				console.log(res)
				this.question = res.data.data.question;
				this.title = res.data.data.title;
				this.description = res.data.data.description;
				this.$store.commit('HIDE_LOADING')
			})
		},
		components:{
			loading
		}
	}
</script>

<style scoped>
	.mt10 {
		margin-top: 10px;
		margin-bottom: 10px;
	}
</style>