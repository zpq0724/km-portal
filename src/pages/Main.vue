<template>
  	<div class="layout">
        <!-- 侧边栏导航 -->
	    <Layout :style="{minHeight: '100vh'}">
        	<Sider 
            collapsible 
            :collapsed-width="78" 
            v-model="isCollapsed">
	        	<Menu 
                ref="side_menu"
                :open-names="[openMenu]" 
                :active-name="currentMenu" 
                accordion 
                theme="dark" width="auto" 
                :class="menuitemClasses" 
                @on-select="onChange">
                    <!-- 首页 -->
                    <MenuItem name="home">
                        <Icon type="md-home" />
                        <span>首页</span>
                    </MenuItem>
					<!-- 用户管理 -->
					<Submenu name="user">
			            <template slot="title"> 
			            	<Icon type="ios-people" />
			            	<span>用户管理</span>
			            </template>
			            <MenuItem name="userList">
			            	<Icon type="md-contacts" />
			            	<span>基本信息</span>
			            </MenuItem>
		            </Submenu>
                    <!-- 问卷管理 -->
                    <!-- <Submenu name="questionnaire">
			            <template slot="title">
			            	<Icon type="md-basket" />
			            	<span>数币管理</span>
			            </template>
			            <MenuItem name="coinList">
			            	<Icon type="md-rewind" />
			            	<span>数币信息</span>
			            </MenuItem>
                        <MenuItem name="commentList">
			            	<Icon type="md-rewind" />
			            	<span>评论列表</span>
			            </MenuItem>
		            </Submenu> -->
		            <!-- 调研管理 -->
		            <Submenu name="investigation">
			            <template slot="title">
			            	<Icon type="ios-paper"></Icon>
			            	<span>调研管理</span>
			            </template>
			            <!-- <MenuItem name="requestList">
			            	<Icon type="md-list" />
			            	<span>调研列表</span>
			            </MenuItem> -->
			            <MenuItem name="templetList">
			            	<Icon type="md-list" />
			            	<span>模板列表</span>
			            </MenuItem>
						<MenuItem name="questionnaireList">
							<Icon type="md-list"/>
							<span>问卷列表</span>
						</MenuItem>
			            <!-- <MenuItem name="communityRating">
			            	<Icon type="md-list" />
			            	<span>社区评级</span>
			            </MenuItem> -->
			            <!-- <MenuItem name="reportList">
			            	<Icon type="md-list" />
			            	<span>报告列表</span>
			            </MenuItem> -->
		            </Submenu>
	        	</Menu>
        	</Sider>
            <!-- 右部分 -->
		    <Layout>
                <!-- 头部 -->
		        <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)', height: '60px'}">
		        <!--用户信息部分 -->
				<UserInfo/>

		        </Header>
                <!-- 内容部分 -->
		        <Content :style="{padding: '0 16px 16px'}">
                    <!-- 面包屑导航 -->
                    <NavBread></NavBread>
                    <!-- 主内容区域 -->
                    <Card>
                        <div style="min-height: calc( 100vh - 200px )">
                            <router-view/>
                        </div>
                    </Card>
		        </Content>
		    </Layout>
		</Layout>
	</div>
</template>

<script>
	import NavBread from '@/components/NavBread';
	import UserInfo from '@/components/UserInfo';
	export default {
        components: {
			NavBread,
			UserInfo
        },
        data() {
            return {
                isCollapsed: false,  // 导航栏是否展开收缩
                openMenu: '',       // 展开的一级菜单
                currentMenu: '',     // 当前的菜单名
            }
        },
        created() {
            this.linkage();
            // this.calPath();
        },
	  	methods: {
            // 点击导航路由跳转
            onChange(name) {
                this.$router.push({name: name});
            },
            // 路由变化时，导航菜单层级联动
            linkage() {
                let matched = this.$route.matched;
                this.openMenu = matched[0].name;
                this.currentMenu = matched[1].name;
                if(this.openMenu == 'main'){
                    this.openMenu = '';
                    this.$nextTick(() => {
                        this.$refs.side_menu.updateOpened();
                    })
                }
            },
        },
        watch: {
            // 监听路由变化
            $route() {
                this.linkage();
                // this.calPath();
            }
        },
        computed: {
            // 侧边栏收缩，展开后的样式
			menuitemClasses() {
		    	return [
	        		'menu-item',
	        		this.isCollapsed ? 'collapsed-menu' : ''
	    		]
	    	}
		},
	}
</script>

<style scoped lang="less">
	.layout-con{
	    height: 100%;
	    width: 100%;
	}
	.menu-item span{
	    display: inline-block;
	    overflow: hidden;
	    width: 69px;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    vertical-align: bottom;
	    transition: width .2s ease .2s;
	}
	.menu-item i{
	    transform: translateX(0px);
	    transition: font-size .2s ease, transform .2s ease;
	    vertical-align: middle;
	    font-size: 16px;
	}
	.collapsed-menu span{
	    width: 0px;
	    transition: width .2s ease;
	}
	.collapsed-menu i{
	    transform: translateX(5px);
	    transition: font-size .2s ease .2s, transform .2s ease .2s;
	    vertical-align: middle;
	    font-size: 22px;
	}
</style>