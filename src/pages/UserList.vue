<template>
    <div>
        <ButtonGroup size="small" class="btn-group">
            <Input class="searchBox" size="small" v-model.trim="searchContent" placeholder="要搜索的内容">
                <Select v-model="searchType" slot="prepend" style="width:80px">
                    <Option value="nickName">昵称</Option>
                    <Option value="Uuid">用户Id</Option>
                    <Option value="phoneNumber">电话号码</Option>
                </Select>
            <Button slot="append" icon="md-search" @click="search"></Button>
            </Input>
        </ButtonGroup>
        <!-- 用户列表信息 -->
        <Table border :columns="columns" :data="userData" :loading="loadingstate"></Table>
        <!-- 分页 -->
        <div class="page">
            <page :total="total" :current="1" show-total @on-change="changePage"></page>
        </div>
        <!--编辑弹框 -->
        <Modal v-model="editUserShow"
            title="编辑用户信息"
	        @on-ok="editUserConfirm">
            <Form :model="editUserItem" :label-width="100">
                <FormItem label="uuid:">
                    <Input type="text" v-model="editUserItem.uuid" placeholder="请输入用户的uuid"></Input>
                </FormItem>
                <FormItem label="昵称:">
                    <Input type="text" v-model="editUserItem.nickName" placeholder="请输入昵称"></Input>
                </FormItem>
                <FormItem label="标题">
                    <Input type="text" v-model="editUserItem.title" placeholder="请输入标题"></Input>
                </FormItem>
                <FormItem label="网址">
                    <Input type="text" v-model="editUserItem.officialUrl" placeholder="请输入网址"></Input>
                </FormItem>
                <FormItem label="头像">
                     <img class="editImg" :src ="editUserItem.headImageUrl"/>
                </FormItem>
                <FormItem label="标志">
                    <img class="editImg" :src ="editUserItem.logoImageUrl"/>
                </FormItem>
                <FormItem label="背景图">
                      <img class="editImg" :src="editUserItem.backgroundImageUrl"/>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
import qs from "qs";

    export default {
        data(){
            return{
                searchContent:"",//搜索内容
                searchType:"",//搜索类型
                loadingstate:false,
                userData:[],//用户列表
                total:0,//分页总数据
                currentPage:1,//当前页
                editUserShow:false,//编辑弹框
                editUserinfo:"",//保存编辑信息
                editUserItem:{
                    uuid:'',
                    nickName:'',
                    title:'',
                    officialUrl:'',
                    headImageUrl:'',
                    logoImageUrl:'',
                    backgroundImageUrl:''
                },
                columns:[
                    {
                        title:'uuid',
                        key:'uuid',
                        width:150
                    },
                    {
                        title:'昵称',
                        key:'nickName',
                        width:150
                    },
                    {
                        title:'头像',
                        key:'headImageUrl',
                        width:80,
                        render: (h,params) => {
                    		return h('Img', {
                    			attrs: {
                    				src: params.row.headImageUrl,
                    				style: 'width: 30px;'
                    			}
                    		})
                    	}
                    },
                    {
                        title:'手机号',
                        key:'phoneNumber',
                        width:150
                    },
                    {
                        title:'标题',
                        key:'title',
                        width:200
                    },
                    {
                        title:'积分',
                        key:'pointerNumber',
                        width:100
                    },
                    {
                        title:'状态',
                        key:'status',
                        width:150,
                        render: (h, params) => {
                    		let status = params.row.status;
                    		switch (status) {
                    			case 1: status = '正常用户'; break;
                    			case 2: status = '禁言用户'; break;
                    			case 3: status = '下线用户'; break;
                    			default: break;
                    		}
                    		return h('div', status);
                    	}
                    },
                    {
                        title:'标志',
                        key:'logoImageUrl',
                        width:100,
                        render: (h,params) => {
                    		return h('Img', {
                    			attrs: {
                    				src: params.row.logoImageUrl,
                    				style: 'width: 30px;'
                    			}
                    		})
                    	}
                    },
                    {
                        title:'背景图',
                        key:'backgroundImageUrl',
                        width:180,
                          render: (h,params) => {
                    		return h('Img', {
                    			attrs: {
                    				src: params.row.backgroundImageUrl,
                    				style: 'width: 30px;'
                    			}
                    		})
                    	}
                        
                    },
                    {
                        title:'品牌网址',
                        key:'officialUrl',
                        width:200
                    },{
                        title:'操作',
                        key:'action',
                        width:300,
                        fixed:'right',
                        align:'center',
                        render:(h,params) =>{
                            return h('div',[
                                h('Button',{
                                    props:{
                                        type:'info',
                                        size:'small'
                                    },
                                    style:{
                                        marginRight:'5px'
                                    },
                                    on:{
                                        click:() =>{
                                            this.show(params.index,params.row.uuid)
                                            //console.log(params.row.uuid)
                                        }
                                    }
                                },'查看用户详情'),
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
											this.editUser(params.row);
											//console.log(params.row)
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style:{
                                        marginRight:'5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index,params.row.uuid)
                                        }
                                    }
                                }, '删除'),
                                 h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                        	this.banned(params.index, params.row.uuid);
                                        }
                                    }
                                }, '禁言'),
                            ])
                        }
                    }
                ]
            }
        },
        mounted(){
            this.loadUserlist(this.currentPage)
        },
        methods:{
            loadUserlist(pageNumber){
               this.loadingstate= true;
                //this.$axios.get('user/lists?pageNumber='+0+'&pageSize='+20+'&searchType='+searchType+'&searchContent='+searchContent)
                //this.$axios.get('user/lists?pageNumber='+0+'&pageSize='+20+'&searchType='+searchContent)
                this.$axios.get('user/lists?pageNumber='+(pageNumber-1)+'&pageSize='+10)
                .then((res)=>{
                    if(res.data.code == 2000){
                        this.userData = res.data.data.rows;
                        this.total = res.data.data.records;
                    }
                    this.loadingstate = false;
                })
            },
            //搜索
            search(){
               let searchType = this.searchType;
               let searchContent = this.searchContent;
                this.loadingstate= true;
                this.$axios.get('user/lists?pageNumber='+0+'&pageSize=10&'+searchType+'='+searchContent)
                .then((res)=>{
                    if(res.data.code == 2000){
                        this.userData = res.data.data.rows;
                        this.total = res.data.data.records;
                        console.log(res)
                    }else{
                       this.$Message.error("此用户不存在");
                    }
                    this.loadingstate = false;
                })
            },
            //分页
            changePage(pageNumber){
                this.loadUserlist(pageNumber)
                this.currentPage = pageNumber;
                console.log(pageNumber)
            },
            //用户详情
            show(index,uuid){
                this.$router.push({path:'userListshow',query:{uuid:uuid}})
            },
            //编辑
            editUser(row){
                this.editUserinfo = row;
                //console.log(this.editUserinfo)
                this.editUserShow = true;
                this.editUserItem = {
                    uuid:row.uuid,
                    nickName:row.nickName,
                    title:row.title,
                    officialUrl:row.officialUrl,
                    headImageUrl:row.headImageUrl,
                    logoImageUrl:row.logoImageUrl,
                    backgroundImageUrl:row.backgroundImageUrl
                }
            },
            //编辑确认
            editUserConfirm(){
                let editUserinfoCon = this.editUserinfo;
                console.log(editUserinfoCon.uuid)
                //console.log(editUserinfoCon)
                let formData = new FormData();
                formData.append("uuid",editUserinfoCon.uuid)
                formData.append("nickName",this.editUserItem.nickName)
                formData.append("title",this.editUserItem.title)
                 formData.append("officialUrl",this.editUserItem.officialUrl)
                this.$axios.post('user/update/basicInfo',formData,
                {headers:{'Content-Type':'multipart/form-dat'}})
                .then((res)=>{                 
                    this.loadingstate = false;
                    this.loadUserlist(this.currentPage)
                    //console.log(this.editUserItem)
                })
            },
            //删除
            remove(index,uuid){
               // alert()
                this.$axios.post('user/remove',qs.stringify({userUuid:uuid}),
                {headers:{'Content-Type':'application/x-www-form-urlencoded'}})
                .then((res)=>{
                            this.userData.splice(index,1);
                            this.$Notice.success({title:"操作成功"});
                            this.loadUserlist(this.currentPage)
                })
            },
            //禁言
            banned(index,uuid){
                this.$Modal.confirm({
                     content: `确认禁言昵称为${this.userData[index].nickName}的用户吗?`,
                     onOk:()=>{
                            this.$axios.post('user/update/status',qs.stringify({userUuid:uuid}),
                            {headers:{'Content-Type':'application/x-www-form-urlencoded'}})
                            .then((res)=>{
                                if(res.data.code == 2000){
                                    this.userData[index].status = 2;
								    this.$Notice.success({ title: '操作成功' }); 
                                    }
                            })
                        }
                    })
            }
        }
        
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
	.selectType {
		float: right;
		width: 100px;
		margin-left: 20px;
	}
	.searchBox {
		float: right;
		width: 280px;
	}

    .editImg{
        width:80px;
        height: 80px;
        }
    .page{
        float:right;
    }
</style>

