import Main from '@/pages/Main'

//登录页路由
const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: '登录'
    },
    component: resolve => { require(['@/pages/login.vue'], resolve); }
};

// 主路由
const appRouter = [
    // 首页
    {
        path: '',
        name: 'main',
        title: '首页',
        redirect: 'home',
        component: Main,
        children: [{
            path: 'home',
            title: '工作台',
            name: 'home',
            meta: { requireAuth: true },
            component: () =>
                import ('@/pages/Home.vue')
        }]
    },
    //用户管理
    {
        path: '/user',
        name: 'user',
        title: '用户管理',
        redirect: '/user/userList',
        component: Main,
        children: [{
            path: 'userList',
            title: '基本信息',
            name: 'userList',
            meta: { requireAuth: true },
            component: () =>
                import ('@/pages/UserList.vue')
        }, {
            path: 'userListshow',
            title: "用户详情",
            nameL: "userList",
            meta: { requireAuth: true },
            component: () =>
                import ('@/pages/userListshow.vue')
        }]
    },
    // 问卷管理

    /*  {
         path: '/questionnaire',
         name: 'questionnaire',
         title: '数币管理',
         redirect: '/questionnaire/coinList',
         component: Main,
         children: [{
                 path: 'coinList',
                 title: '数币信息',
                 name: 'coinList',
                 meta: { requireAuth: true },
                 component: () =>
                     import ('@/pages/CoinList.vue')
             },
             {
                 path: 'commentList',
                 title: '评论列表',
                 name: 'commentList',
                 meta: { requireAuth: true },
                 component: () =>
                     import ('@/pages/CommentList.vue')
             }
         ]
     }, */
    // 调研管理
    {
        path: '/investigation',
        name: 'investigation',
        title: '调研管理',
        redirect: '/investigation/requestList',
        component: Main,
        children: [{
                path: 'requestList',
                title: '请求列表',
                name: 'requestList',
                meta: { requireAuth: true }, //添加该字段，表示进入这个路由是需要登录的
                component: () =>
                    import ('@/pages/InvestigationRequestList.vue')
            },
            {
                path: 'templetList',
                title: '模板列表',
                name: 'templetList',
                meta: { requireAuth: true },
                component: () =>
                    import ('@/pages/templetList.vue')
            },
            {
                path: 'questionnaireList',
                title: '问卷列表',
                name: 'questionnaireList',
                meta: { requireAuth: true },
                component: () =>
                    import ('@/pages/QuestionnaireList.vue')
            },
            /*  {
                 path: 'completedList/:id',
                 title: '已完成列表',
                 name: 'completedList',
                 meta: { requireAuth: true },
                 component: () =>
                     import ('@/pages/CompletedList.vue')
             }, */
            {
                path: 'completedDetail/:uuid',
                title: '查看详情',
                name: 'completedDetail',
                meta: { requireAuth: true },
                component: () =>
                    import ('@/pages/CompletedDetail.vue')
            },
            {
                path: 'templetShow',
                title: '模板详情',
                name: 'templetShow',
                meta: { requireAuth: true },
                component: () =>
                    import ('@/pages/templetShow.vue')
            },
            {
                path: 'questionShow',
                title: '问卷详情',
                name: 'questionShow',
                meta: { requireAuth: true },
                component: () =>
                    import ('@/pages/QuestionShow.vue')
            },
            /*  {
                 path: 'communityRating',
                 title: '社区评级',
                 name: 'communityRating',
                 meta: { requireAuth: true },
                 component: () =>
                     import ('@/pages/CommunityRating.vue')
             }, */
            /*  {
                 path: 'reportList',
                 title: '报告列表',
                 name: 'reportList',
                 meta: { requireAuth: true },
                 component: () =>
                     import ('@/pages/ReportList.vue')
             } */
        ]
    },
    // 模型管理
    // {

    // },
    // 付费管理
    // {

    // }

];

export const routers = [
    loginRouter,
    ...appRouter,
]