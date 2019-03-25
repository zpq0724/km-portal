import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from './store'
import { baseUrl } from '@/config/env'

// 全局引入iview和iview样式
import iView from 'iview'
import 'iview/dist/styles/iview.css';
//require('animate.css/animate.min.css')
import animate from 'animate.css'

Vue.use(iView)

// 引入公共样式
import '@/style/common.less'

// 引入覆盖iview的样式
import '@/style/theme.less'

// axios配置
Vue.prototype.$axios = axios;
axios.defaults.baseURL = '/api';

//cookie相关函数
Vue.prototype.cookieHandler = {
    setCookie: (c_name, value, expiredays) => {
        let exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ';path=/';
    },
    removeCookie: (name) => {
        Vue.prototype.cookieHandler.setCookie(name, "", -1);
    },
    getCookie: (c_name) => {
        if (document.cookie.length > 0) {
            let c_start = document.cookie.indexOf(c_name + "=");
            let c_end = '';
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                }
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    }
}

//localStorage相关函数
Vue.prototype.storageHandler = {
    setStorage: (key, value) => {
        localStorage.setItem(key, value);
    },
    removeStorage: () => {
        localStorage.removeItem('nickName'); //括号中是登陆是属性
    }
}

//http request拦截器
axios.interceptors.request.use(
    config => {
        let token = Vue.prototype.cookieHandler.getCookie('token') //从cookie中取出token;
        if (token) {
            config.headers['token'] = token; //全局配置请求头中添加 token
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);
//http response 服务器响应拦截器，这里拦截401错误，并重新跳入登陆页面重新获取token
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 这里写清除token的代码
                    Vue.prototype.cookieHandler.removeCookie('token');
                    Vue.prototype.storageHandler.removeStorage('nickName');
                    Vue.prototype.storageHandler.removeStorage('adminUuid');
                    console.log('token过期');
                    router.replace({
                        path: 'login',
                        query: { redirect: router.currentRoute.fullPath } //登录成功后跳入浏览的当前页面
                    })
            }
        }
        return Promise.reject(error.response.data)
    }
);
/**
 * 全局导航守卫
 * 1.拦截登陆
 * 2.路由切换顶部动画
 */
router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    let token = Vue.prototype.cookieHandler.getCookie('token'); //从cookie中获取token
    if (to.meta.requireAuth) { //路由自定义字段requireAuth，用于判断该路由的访问是否需要登录
        if (token && token != '') {
            next();
        } else {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
        }
    } else {
        next();
    }
});

router.afterEach(route => {
    iView.LoadingBar.finish();
});

Vue.config.productionTip = false //阻止启动生产对象

// 实例化vue
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})