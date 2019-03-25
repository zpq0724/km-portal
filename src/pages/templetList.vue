<template>
	<div>
		<ButtonGroup size="small" class="btn-group" >
			<Button type="primary" @click="questionnaireAdd">新增模板</Button>
			<!-- 搜索 -->
			<Input class="searchBox" size="small" v-model.trim="searchContent" placeholder="要搜索的内容" style="width: 300px">
				<Select v-model="searchType" slot="prepend" style="width: 80px" @on-change="selectChange">
		            <Option value="title">模板名称</Option>
		            <Option value="type">模板类型</Option>
		        </Select>
				<Select  slot="prepend" style="width: 85px;" :class="selectTwo?'':'selecttwoStyle'">
		            <Option value="titleone">调查类-1</Option>
		            <Option value="typetwo">问卷类-2</Option>
					<Option value="typethr">产品类-3</Option>
					<Option value="typetfou">奢侈品-4</Option>
		        </Select>
				<Button slot="append" icon="md-search" @click="searchQuestionnaire"></Button>
			</Input>
		</ButtonGroup>
		<Table border highlight-row :columns="columns" :data="data" :loading="loadingState" @on-current-change="changeQuestionnaire" ></Table>
		<div style="width: 100%;">
			<div class="page">
				<Page :total="total" :current="1" show-total @on-change="changePage"></Page>
			</div>
		</div>
		<div class="text-center" style="margin-top: 100px">问题列表</div>
		<ButtonGroup size="small" class="btn-group">
			<Button type="primary" @click="questionAdd">新增问题</Button>
		</ButtonGroup>
		<Table border highlight-row :columns="questionColumns" :data="questionData" :loading="questionLoadingState" @on-current-change="changequestion"></Table>
		
		<div class="text-center" style="margin-top: 50px">选项列表</div>
		<ButtonGroup size="small" class="btn-group">
			<Button type="primary" @click="optionAdd">新增选项</Button>
		</ButtonGroup>
		<Table border :columns="optionColumns" :data="optionData" :loading="optionLoadingState"></Table>
		<!-- 新增模板弹框 -->
		<Modal
	        v-model="addQuestionnaireShow"
	        title="新增模板"
	        @on-ok="addQuestionnaireConfirm">
	        <Form :model="questionnaireItem" :label-width="100">
		        <FormItem label="模板名称:">
		            <Input v-model="questionnaireItem.title" placeholder="请输入模板名称"></Input>
		        </FormItem>
				<FormItem label="模板类型:">
					   <Select v-model="questionnaireItem.type">
						   <Option value="1">调查类</Option>
						   <Option value="2">产品类</Option>
						   <Option value="3">品牌类</Option>
						   <Option value="4">奢侈品</Option>
					   </Select>
				</FormItem>
		        <FormItem label="描述:">
		            <Input v-model="questionnaireItem.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入描述"></Input>
		        </FormItem>
				 <FormItem label="创建起始时间:">
		            <DatePicker type="date" placeholder="模板创建起始时间" v-model="questionnaireItem.onlineTime" :options="onlineTimeOptions" @on-change="onlineTimeChange"></DatePicker>
		        </FormItem>
				 <FormItem label="创建截至时间:">
		            <DatePicker type="date" placeholder="模板创建截至时间" v-model="questionnaireItem.offlineTime" :options="offlineTimeOptions" @on-change="offlineTimeChange"></DatePicker>
		        </FormItem>	       	       
			</Form>
	    </Modal>
		<!--编辑模板 -->
		<Modal
	        v-model="editQuestionnaireShow"
	        title="编辑模板"
	        @on-ok="editQuestionnaireConfirm">
	        <Form :model="questionnaireItem" :label-width="100">
		        <FormItem label="模板名称:">
		            <Input v-model="questionnaireItem.title" placeholder="请输入模板名称"></Input>
		        </FormItem>
		        <FormItem label="描述:">
		            <Input v-model="questionnaireItem.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入描述"></Input>
		        </FormItem>
				 <FormItem label="创建起始时间:">
		            <DatePicker type="date" placeholder="模板创建起始时间" v-model="questionnaireItem.onlineTime" :options="onlineTimeOptions" @on-change="onlineTimeChange"></DatePicker>
		        </FormItem>
				 <FormItem label="创建截至时间:">
		            <DatePicker type="date" placeholder="模板创建截至时间" v-model="questionnaireItem.offlineTime" :options="offlineTimeOptions" @on-change="offlineTimeChange"></DatePicker>
		        </FormItem>	       	       
			</Form>
	    </Modal>
		<!-- 新增问题弹框 -->
		<Modal
	        v-model="addQuestionShow"
	        title="新增问题"
	        @on-ok="addQuestionConfirm">
	        <p style="margin-bottom: 20px;">模板名: {{currentQuestionnaire}}</p>
			<p>序号:</p>
			<Input v-model="questionOrder"></Input>
	        <p>问题名称:</p>
	        <Input v-model="questiontitle"></Input>
	        <p>类型:</p>
	        <Select v-model="questionType">
	        	<Option value="0">单选</Option>
	        	<Option value="1">多选</Option>
	        	<Option value="2">填空</Option>
	        	<Option value="3">评分</Option>
				<Option value="4">日期</Option>
	        	<Option value="5">性别</Option>
	        </Select>
	        <p v-show="questionType == 3">最小评级描述</p>
	        <Input v-model="minDescription" v-show="questionType == 3"></Input>
	        <p v-show="questionType == 3">最大评级描述</p>
	        <Input v-model="maxDescription" v-show="questionType == 3"></Input>
			<!-- 性别 -->
			<div v-show="questionType == 5">			
                    <input type="radio" name="sex" style="margin: 10px 0 0 15px;" id="man" value="男"/>    
                    <label for="man">男</label>
                    <input type="radio" name="sex" style="margin: 10px 0 0 15px;" id="woman" value="女"/>
                    <label for="woman">女</label>  
			</div>
			<!-- 日期 -->
			<p v-show="questionType == 4" style="margin-top:8px;">
				 <Date-picker type="date" placeholder="选择日期" style="width: 200px"></Date-picker>
			</p>
	    </Modal>
		<!-- 编辑问题弹框 -->
		<Modal
	        v-model="editQuestionShow"
	        title="编辑问题"
	        @on-ok="editQuestionConfirm">
	        <p style="margin-bottom: 20px;">模板名: {{currentQuestionnaire}}</p>
			 <p>序号:</p>
	        <Input v-model="questionOrder"></Input>
	        <p>问题名称:</p>
	        <Input v-model="questiontitle"></Input>
	        <p>类型:</p>
	        <Select v-model="questionType">
	        	<Option value="0">单选</Option>
	        	<Option value="1">多选</Option>
	        	<Option value="2">填空</Option>
	        	<Option value="3">评分</Option>
				<Option value="4">日期</Option>
	        	<Option value="5">性别</Option>
	        </Select>
			<!-- 评分题的评级描述 -->
	        <p v-show="questionType == 3">最小描述</p>
	        <Input v-model="minDescription" v-show="questionType == 3"></Input>
	        <p v-show="questionType == 3">最大描述</p>
	        <Input v-model="maxDescription" v-show="questionType == 3"></Input>
			<!-- 性别 -->
			<div v-show="questionType == 5">	
                    <input type="radio" name="sex" style="margin: 10px 0 0 15px;" id="man" value="男" />
                    <label for="man">男</label>
                    <input type="radio" name="sex" style="margin: 10px 0 0 15px;" id="woman" value="女" />
                    <label for="woman">女</label>   
			</div>
			<!-- 日期 -->
			<p v-show="questionType == 4" style="margin-top:8px;">
				 <Date-picker type="date" placeholder="选择日期" style="width: 200px"></Date-picker>
			</p>
	    </Modal>
		<!-- 新增选项弹框 -->
	    <Modal
	        v-model="addOptionShow"
	        title="新增选项"
	        @on-ok="addOptionConfirm">
	        <p style="margin-bottom: 20px;">问题名: {{currentQuestion}}</p>
	        <p>选项名称(评分题时为等级级别):</p>
	        <Input v-model="optionName"></Input>
	        <p>排序:</p>
	        <Input v-model="optionOrder"></Input>
	        <p>分数</p>
	        <Input v-model="score"></Input>
	    </Modal>
		<!-- 编辑选项弹框 -->
		 <Modal
	        v-model="editOptionShow"
	        title="编辑选项"
	        @on-ok="editOptionConfirm">
	        <p style="margin-bottom: 20px;">问题名: {{currentQuestion}}</p>
	        <p>选项名称(评分题时为等级级别):</p>
	        <Input v-model="optionName"></Input>
	        <p>排序:</p>
	        <Input v-model="optionOrder"></Input>
	        <p>分数</p>
	        <Input v-model="score"></Input>
	    </Modal>
	</div>
</template>

<script>
import qs from "qs";
	export default{
		data(){
			return {
				loadingState:false,//表格数据Loading
				title:"",
				searchContent:"",//搜索的内容
				searchType:"",//搜索类型
				typeone:"调查类",//搜索框嵌套
				selectTwo:false,
				addQuestionnaireShow:false, //新增模板弹窗开关
				loadingState: false,	//表格读取状态
				total: 0,//模板总数
				questionnaireId:"",  //模板Id                             
				onlineTimeOptions: {}, //开始日期设置
                offlineTimeOptions: {}, //结束日期设置
				onlineTime:"",//模板起始时间
				currentPage: 1,//当前页
				offlineTime:"",//模板截至时间
				editQuestionnaireShow:false,//编辑模板状态
				columns: [
					{
	                    title: 'uid',
	                    key: 'uid',
	                    width: 60
	                },
	                {
	                    title: '模板名称',
	                    key: 'title',
	                    width: 200
	                },
	                {
	                    title: '模板描述',
	                    width: 150,
	                 	key:'description'
					},
					{
	                    title: '模板类型',
	                    width: 100,
						 key:'type',
						 render:(h,params) =>{
							 let type= params.row.type;
							 switch(type){
								 case 1:type="调查类";break;
								 case 2:type="产品类";break;
								 case 3:type="品牌类";break;
								 case 4:type="奢侈品";break;
								 default:break;
							 }
							 return h('div',type);
						 }
	                },
	                {
	                    title: '状态',
	                    key: 'onlineStatus',
	                    width: 130,
	                    render: (h, params) => {
	                        const row = params.row;
	                        const color = row.onlineStatus === 1? '#000' : row.onlineStatus === 2 ? '#2db7f5' : row.onlineStatus === 3 ? '#f90' : '#ed3f14';
	                        const text = row.onlineStatus === 1 ? '未上线' : row.onlineStatus === 2 ? '测试中' : row.onlineStatus === 3 ? '已上线' : '已下线';
	                        return h('Tag', {
	                            props: {
	                                type: 'dot',
	                                color: color
	                            }
	                        }, text);
	                    }
	                },	      
	                {
	                	title: '开始时间',
	                    key: 'onlineTime',
						width: 150,
	                },
	                {
	                	title: '结束时间',
	                    key: 'offlineTime',
						width: 150,
	                },
	                {
                    	title: '操作',
                    	key: 'action',
                    	width: 400,
                    	fixed: 'right',
                    	align: 'center',
                    	render: (h, params) => {
                    		return h('div', [
                                h('Button', {
                                    props: {
                                        type: params.row.onlineStatus == 3?'error':'warning',
                                        size: 'small'
									},
									 style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                        	if (params.row.onlineStatus == 3) {
                                        		this.offLineQuestionnaire(params.index, params.row.uid);
                                        	} else {
                                        		this.onLineQuestionnaire(params.index, params.row.uid);
                                        	}
                                        }
                                    }
                                }, params.row.onlineStatus == 3?'下线':'上线'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.toTempletShow(params.row.uid);
                                        }
                                    }
                                }, '模板详情'),
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
											this.editQuestionnaire(params.row);
											//console.log(params.row)
                                        }
                                    }
                                }, '编辑'),


                            ]);
                    	}
                    }
                ],
				data:[],//模板模板列表数据
				questionnaireItem:{
					uid:"",
					title:'',
					description:'',
					type:'', //问卷类型
					onlineTime:'',
					offlineTime:''
				},
				questionData:[],
				editQuestionShow:false,
				addQuestionShow:false,
				currentQuestionType:"",
				currentOptionUid:'',
				currentQuestionnaire:"",
				currentQuestion:"",
				optionName:"",
				optionOrder:"",
				score:"",
				questionUid:"",
				questiontitle:"",
				questionType:"",
				questionOrder:"",
				minDescription:"",
				maxDescription:"",
				questionColumns: [
					{
	                    title: 'uid',
	                    key: 'uid'
	                },
	                {
	                    title: '问题名称',
	                    key: 'title'
	                },
	                {
	                	title: '类型',
                        key: 'optionType',
                        render: (h, params) => {
                        	let optionType = params.row.optionType;
                        	switch(optionType){
                        		case 0: optionType = '单选'; break;
	                			case 1: optionType = '多选'; break;
	                			case 2: optionType = '填空'; break;
								case 3: optionType = '评分'; break;
								case 4: optionType = '日期'; break;
	                			case 5: optionType = '性别'; break;
	                			default: break;
                        	}
                        	return h('div', optionType);
                        }
	                },
	                {
	                    title: '序号',
	                    key: 'showOrder'
	                },
	                {
                    	title: '操作',
                    	key: 'action',
                    	align: 'center',
                    	render: (h, params) => {
                    		return h('div', [
                    			h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                        	this.questiontitle = params.row.title;
                                        	this.questionType = params.row.optionType + '';
                                        	this.questionOrder = params.row.showOrder;
                                        	this.maxDescription = params.row.maxDescription;
                                        	this.minDescription = params.row.minDescription;
                                            this.editQuestionShow = true;
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.removeQuestion(params.index, params.row.uid);
                                        }
                                    }
                                }, '删除')
                            ]);
                    	}
                    }
                ],
				questionLoadingState:false,
				addOptionShow:false,
				optionData:[],
				editOptionShow:false,
				optionLoadingState:false,
				optionColumns: [
					{
	                    title: 'uid',
	                    key: 'uid'
	                },
	                {
	                    title: '选项名称',
	                    key: 'content'
	                },
	                {
	                	title: '分数',
	                	key: 'score'
	                },
	                {
	                	title: '选项类型',
	                	key: 'optionType',
	                	render: (h, params) => {
	                		let optionType = params.row.optionType;
	                		switch(optionType){
	                			case 0: optionType = '单选'; break;
	                			case 1: optionType = '多选'; break;
	                			case 2: optionType = '填空'; break;
								case 3: optionType = '评分'; break;
								case 4: optionType = '日期'; break;
	                			case 5: optionType = '性别'; break;
	                			default: break;
	                		}
	                		return h('div', optionType);
	                	}
	                },
	                {
	                    title: '序号',
	                    key: 'showOrder'
	                },
	                {
                    	title: '操作',
                    	key: 'action',
                    	align: 'center',
                    	render: (h, params) => {
                    		return h('div', [
                    			h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                        	this.currentOptionUid = params.row.uid;
                                        	this.optiontitle = params.row.content;
                                        	this.optionOrder = params.row.showOrder;
                                        	this.optionType = params.row.optionType + '';
                                        	this.score = params.row.score;
                                            this.editOptionShow = true;
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.removeOption(params.index, params.row.uid);
                                        }
                                    }
                                }, '删除')
                            ]);
                    	}
                    }
                ],

			}
		},
		mounted(){
			this.loadList(this.currentPage)
		},
		methods: {
			//模板类型的选择
			selectChange(val){
				console.log(val)
				if(val == "type" ){ //"type"是字符串，不加引号是变量
					this.selectTwo = true;
					this.searchContent ="";				
				}else{
					this.selectTwo = false;
				}			
			},
			//获取模板列表
			loadList(pageNumber){
				this.loadingState = true; 
				let page = {
					pageNumber: pageNumber-1,
					pageSize: 10,
				};
				//判断是否搜索
 				if(this.searchType !== ""){
					page[this.searchType] = this.searchContent;
					
				}
				this.$axios.post('/templet/list',qs.stringify(page),
				{headers:{'Content-Type':'application/x-www-form-urlencoded'}})
				.then((res)=>{
					this.data = res.data.data.rows;
					this.total = res.data.data.records
					this.handleData();
					this.loadingState = false;
				})
			},
			//搜索
			searchQuestionnaire(){
				this.currentPage = 1;
				this.loadList(1)
			},
			//起始，截至时间控制
			onlineTimeChange(e){ //设置开始时间
                this.onlineTime = e;
                this.offlineTimeOptions = {
                  disabledDate: date => {
                    let onlineTime = this.onlineTime ? new Date(this.onlineTime).valueOf() : '';
                    return date && (date.valueOf() < onlineTime);
                  }
                }
              },
          	offlineTimeChange(e){ //设置结束时间
            this.offlineTime = e;
            let offlineTime = this.offlineTime ? new Date(this.offlineTime).valueOf() - 1 * 24 * 60 * 60 * 1000 : '';
            this.onlineTimeOptions = {
              disabledDate(date) {
                return date && date.valueOf() > offlineTime;
              }
            }
	      },
			//点击模板
			changeQuestionnaire(currentRow, oldCurrentRow) {//currentRow:当前行数据;oldCurrentRow:上一条数据
				let questionnaireId = currentRow.uid;
				//console.log(questionnaireId)
				this.questionnaireId = questionnaireId;
				this.questionUid = '';
				this.currentQuestionType = '';
				this.currentQuestionnaire = currentRow.title;
				//console.log(this.currentQuestionnaire);
				 this.loadQuestionList(questionnaireId);
			},
			/*点击问题*/
			changequestion(currentRow, oldCurrentRow) {
				let questionId = currentRow.uid
				this.questionUid = questionId;
				this.currentQuestionType = currentRow.optionType;
				this.currentQuestion = currentRow.title;
				this.loadOptionList(questionId);
			},
			/* 新增模板 */
			questionnaireAdd(){
				this.questionnaireItem = { //将新增模板弹框中的数据放在this.questionnaireItem中
					title:'',
					description:'',
					onlineTime:'',
					offlineTime:''
				},
				this.addQuestionnaireShow = true
			},
			/* 确认新增模板 */
			addQuestionnaireConfirm(){
				// this.loadingState = true;
				this.questionnaireItem.onlineTime = (parseInt(new Date(this.questionnaireItem.onlineTime).getTime())).toString();
				this.questionnaireItem.offlineTime = (parseInt(new Date(this.questionnaireItem.offlineTime).getTime())).toString();
				//let questionnaire = JSON.stringify(this.questionnaireItem);
				this.$axios.post('/templet/add',qs.stringify(this.questionnaireItem),
				{headers:{'Content-Type':'application/x-www-form-urlencoded'}}
				).then((res)=>{
						this.$Notice.success({ title: '操作成功' });
						this.loadList(this.currentPage);
				})
			},
			//编辑模板
			editQuestionnaire(row){
				this.editQuestionnaireShow = true;
				this.questionnaireItem = {
					uid: row.uid,
					title: row.title,
					description:row.description,
					onlineTime:row.onlineTime,
					offlineTime:row.offlineTime
				}
			},
			//编辑模板确认
			editQuestionnaireConfirm(){
				this.loadingState = true;
				this.questionnaireItem['uid'] = this.questionnaireId;
				this.questionnaireItem.onlineTime = (parseInt(new Date(this.questionnaireItem.onlineTime).getTime())).toString();
				this.questionnaireItem.offlineTime = (parseInt(new Date(this.questionnaireItem.offlineTime).getTime())).toString();
				this.$axios.post('templet/update',qs.stringify(this.questionnaireItem),
				{headers:{'Content-Type':'application/x-www-form-urlencoded'}})
				.then((res)=>{
					console.log(res)
					if(res.data.code == 2000){
						//this.$Message.success({content:"问卷编辑成功"})
						this.$Notice.success({title:"模板编辑成功"})
						this.loadList(this.currentPage)
					}
					this.loadingState = false;
				})
			},
			//获取问题列表
			loadQuestionList(questionnaireId){
				this.questionLoadingState = true;
				this.$axios.get('templet/question/list?questionnaireId='+questionnaireId)
				.then((res)=>{
					//console.log(res)
					this.optionData =  [];
					this.questionData = res.data.data;
					this.questionLoadingState = false;
				})
				.catch((error)=>{
					this.questionLoadingState = false;
				})
			},
			//获取选项列表
			loadOptionList(questionId){
				this.optionLoadingState = true;
				this.$axios.get('templet/option/list?questionId='+questionId).then((res)=>{
					//console.log(res)
						this.optionData = res.data.data;
						this.optionLoadingState = false;
				})
				.catch((error) => {
					this.optionLoadingState = false;
				})
			},
			//分页
 			changePage (pageNumber) {
           		this.loadList(pageNumber);
                this.currentPage = pageNumber;
                console.log(pageNumber)    
			},
			//新增问题
			questionAdd(){
				if(this.questionnaireId == ""){
					this.$Notice.warning({"title":"请先选择模板"})
				}else{
					this.questiontitle = '';
					this.questionType = '';
					this.questionOrder = '';
					this.minDescription = '';
					this.maxDescription = '';
					this.addQuestionShow = true;			
				}
			},
			//新增问题确认
			addQuestionConfirm(){
				this.questionLoadingState = true;
				let formItem = {};
				formItem['questionnaireId'] = this.questionnaireId;
				formItem['title'] = this.questiontitle;
				formItem['optionType'] = this.questionType;
				formItem['showOrder'] = this.questionOrder;
				formItem['maxDescription'] = this.maxDescription;
				formItem['minDescription'] = this.minDescription;
				this.$axios.post('templet/question/add',qs.stringify(formItem),
				{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.then((res)=>{
					console.log(res);
					if(res.data.code == 2000){
						this.$Notice.success({title:'操作成功'});
						this.loadQuestionList(this.questionnaireId);
						this.questionLoadingState = false;
					}				
				})
			},
			//编辑问题确认
			editQuestionConfirm(){
				this.questionLoadingState = true;
				let formItem = {};
				formItem['title'] = this.questiontitle;
				formItem['optionType'] = this.questionType;
				formItem['showOrder'] = this.questionOrder;
				formItem['uid'] = this.questionUid;
				formItem['maxDescription'] = this.maxDescription;
				formItem['minDescription'] = this.minDescription;
				this.$axios.post('templet/question/update',qs.stringify(formItem),
				{headers:{'Content-Type':'application/x-www-form-urlencoded'}})
				.then((res)=>{
					if(res.data.code == 2000){
						this.$Notice.success({title:'操作成功'});
						this.loadQuestionList(this.questionnaireId);
					}
					this.questionLoadingState = false;
				})
			},
			//新增选项
			optionAdd(){
				if (this.questionUid == '') {
					this.$Notice.warning({ title: '请先选择问题' });
				} else if (this.currentQuestionType == 2 || this.currentQuestionType == 4 || this.currentQuestionType == 5) {
					this.$Notice.warning({ title: '填空题不能添加选项' });
				} else {
					this.optionName = '';
					this.optionOrder = '';
					this.score = '';
					this.addOptionShow = true;
				}
			},
			//新增选项确认
			addOptionConfirm(){
				this.optionLoadingState = true;
				let formItem = {};
				formItem['questionId'] = this.questionUid;
				formItem['content'] = this.optionName;
				formItem['showOrder'] = this.optionOrder;
				if(this.optionName == '其他' || this.optionName == '其它'){
					formItem['optionType'] = 3;
				} else {
					formItem['optionType'] = this.currentQuestionType;
				}
				formItem['score'] = this.score;
				this.$axios.post('templet/option/add',qs.stringify(formItem),
				{headers:{'Content-Type':'application/x-www-form-urlencoded'}})
				.then((res)=>{
					console.log(res)
					 this.$Notice.success({title:'操作成功'});
					this.loadOptionList(this.questionUid);
					this.optionLoadingState = false; 
				})
			},
			//编辑选项确认
			editOptionConfirm(){
				this.optionLoadingState = true;
				let formItem = {};
				formItem['uid'] = this.currentOptionUid;
				formItem['content'] = this.optionName;
				formItem['showOrder'] = this.optionOrder;
				if (this.optionName == '其它' || this.optionName == '其他') {
					formItem['optionType'] = 3;
				} else {
					formItem['optionType'] = this.optionType;
				}
				formItem['score'] = this.score;
				this.$axios.post('templet/option/update',qs.stringify(formItem),
				{headers:{'Content-type':'application/x-www-form-urlencoded'}})
				.then((res)=>{
					if(res.data.code == 2000){
						this.$Notice.success({title:'操作成'})
						this.loadOptionList(this.questionUid)
					}
					this.optionLoadingState = false;
				})
			},
			//删除问题
			removeQuestion(index,uid){
				let adminUuid = localStorage.adminUuid;
				this.$Modal.confirm({
					content:"确认删除该问题吗?",
					onOk:()=>{
						this.questionLoadingState = true;
						this.$axios.post('templet/question/delete',qs.stringify({uid:uid,adminUuid:adminUuid}),
						{headers:{'Content-Type':'application/x-www-form-urlencoded'}})
						.then((res) => {
							if(res.data.code == 2000){
								this.questionData.splice(index,1);
								this.$Notice.success({title:'操作成功'});
							} else {
								this.$Notice.error({title:'操作失败'});
							}
							this.questionLoadingState = false;
							
						})
					}
				})
			},
			//删除选项
			removeOption(index,uid){
				let adminUuid = localStorage.adminUuid;
				this.$Modal.confirm({
					content:"确认删除该选项吗？",
					onOk:()=>{
						this.optionLoadingState = true;
						this.$axios.post('templet/option/delete',qs.stringify({uid:uid}),
						{headers:{'Content-Type':'application/x-www-form-urlencoded'}})
						.then((res)=>{
							if(res.data.code == 2000){
								this.optionData.splice(index,1);
								this.$Notice.success({title:"操作成功"});
							} else {
								this.$Notice.error({title:"操作失败"});
							}
							this.optionLoadingState =false;
						})
					}
				})
			},
			/*数据处理*/
			handleData () {
				this.data.forEach((item, index) => {
					item.onlineTime = this.formatDate(item.onlineTime);
					item.offlineTime = this.formatDate(item.offlineTime);
				});
			},
			//模板详情页
			toTempletShow(uid){
				this.$router.push({path:'templetShow',query:{templetId:uid}})
			},
			//上线
			onLineQuestionnaire(index,uid){
				let questionnaireId = uid;
				this.$Modal.confirm({
					content:"确认上线该模板吗",
					onOk:()=>{
						this.loadingState = true;
						this.$axios.post('templet/questionnaire/online',qs.stringify({questionnaireId:questionnaireId}),
						{headers:{'Content-Type':'application/x-www-form-urlencoded'}})
						.then((res)=>{
						 if(res.data.code == 2000){
							 this.data[index].onlineStatus = 3;
							 this.$Notice.success({title:'操作成功'})
						 }else{
							 this.$Notice.error({title:'操作失败'})
						 }
						  this.loadingState = false;
						})
					}
				})
			},
			// 下线
			offLineQuestionnaire(index,uid){
				let questionnaireId = uid;
				this.$Modal.confirm({
					content:"确认下线该模板吗",
					onOk:()=>{
						this.loadingState = true;
						this.$axios.post('templet/questionnaire/remove',qs.stringify({questionnaireId:questionnaireId}),
						{headers:{'Content-Type':'application/x-www-form-urlencoded'}})
						.then((res)=>{
						 if(res.data.code == 2000){
							 this.data[index].onlineStatus = 9;
							 this.$Notice.success({title:'操作成功'})
						 }else{
							 this.$Notice.error({title:'操作失败'})
						 }
						  this.loadingState = false;
						})
					}
				})
			},
			//时间格式化
        	formatDate (timestamp){
				let date = new Date(timestamp);
		        let Y = date.getFullYear() + '-';
		        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		        let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
		        let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
		        let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
		        let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
		        return Y+M+D+h+m+s;
			} 
		},
	}
</script>

<style>
	.btn-group {
		margin-bottom: 10px;
		margin-right: 20px;
		width: 100%;
	}
	.btn-group button.ivu-btn {
		float: right;
	}
	.searchBox {
		float: right;
		width: 280px;
		margin-right: 20px;
	}
	.page {
		float: right;
		margin-top: 20px;
	}
	.text-center {
		text-align: center;
	}
	.dailyNumList {
		list-style: none;
	}
	.selecttwoStyle{
		display: none;
		border:1px solid red;
	}
</style>