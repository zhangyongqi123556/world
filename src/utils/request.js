import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'
// create 创建 axios 实例
const request = axios.create({

})

function redirectLogin () {
    router.push({
    name: 'login',
    query: {
    // router.currentRoute ⽤于获取当前路由对应的路由信息对象
    redirect: router.currentRoute.fullPath
     }
     })
    }

/* 存储是否正在更新 Token 的状态 */
let isRefreshing = false
/* 存储因为等待 Token 刷新而挂起的请求 */
let requests = []

function getBaseURL (url){
    if(url.startsWith('/boss')){
        return 'http://eduboss.lagounews.com'
    }else{
        return 'http://edufront.lagounews.com'
    }
}
/* 请求拦截器 */
request.interceptors.request.use(function (config){
    config.baseURL = getBaseURL(config.url)
    /* 可以读取 store 中的 user 后进⾏ Token 检测 */
    const { user } = store.state
    if (user && user.access_token) {
         // 设置 Token
        config.headers.authorization = user.access_token
         }
        
    return config
})

/* 响应拦截器 */
 request.interceptors.response.use(function (response) {
     // Any status code that lie within the range of 2xx cause thisfunction to trigger
     // Do something with response data
     /* 状态码 2xx会执行到这里 */
     return response
     }, function (error) {
        if (error.response) {
            // 请求发送成功，也收到了响应，到状态码超过了2xx（常⻅错误处理位置）
             // 1. 保存状态码
             const { status } = error.response
             // 2. 判断
             let errorMessage = ''
             if (status === 400) {
             errorMessage = '请求参数错误'
             } else if (status === 401) {
             if (!store.state.user) {
                redirectLogin()
                 // 阻⽌后续操作，向下抛出错误对象
                 return Promise.reject(error)
                }
            /* 检测是否存在了正在刷新的 Token 的请求 */
            if (isRefreshing){
              return  requests.push(()=>{
                    request(error.config)
                })
            }
            isRefreshing = true
             /* 根据 refresh_token 请求新的 access_token 当前 else if 应当设置 return，就不会执⾏整个 if 后⾯的错误信
             息 return 了（严谨些）*/
                return request({
                    method: 'POST',
                    url: '/front/user/refresh_token',
                    data: qs.stringify({
                        refreshtoken: store.state.user.refresh_token
                    })
                }).then(res =>{
                    /* 检测，是否成功请求到新的 access_token */
                    /*  1. 如果没有请求到新的 access_token，跳转回登录⻚ */
                    if (res.data.state !== 1){
                        /* 清除已经⽆效的⽤户信息 */
                        store.commit('setUser', null)
                        /* 跳转登录⻚ */
                        redirectLogin()
                         /* 阻⽌后续操作，向下抛出错误对象 */   
                         return Promise.reject(error)
                    }
                    /* 2. 如果成功，将新的 access_token 更新到容器与本地存储中 */
                    store.commit('setUser', res.data.content)
                    /* 这时再对之前报 401 的接⼝重新请求，同时 return 
                    - error.config 是之前失败的请求的配置信息
                    - request() 内部已经将原请求的所有功能包含了，⽆需接收结果返回 */
                    /* 重新发送失败的请求 （根据 requests 发送所有失败的请求） */
                    requests.forEach(callbanck => callbanck())
                    /* 发送完毕 清楚requests 内容即可 */
                    requests=[]
                    /* 将本次请求发送 */
                    return request(error.config)
                }).catch(() =>{
                 console.log(err)
                }).finally(() =>{
                    isRefreshing = false
                })
             } else if (status === 403) {
             errorMessage = '没有权限，请联系管理员'
             } else if (status === 404) {
             errorMessage = '请求资源不存在'
             } else if (status >= 500) {
             errorMessage = '服务端错误，请联系管理员'
             }
             Message.error(errorMessage)
             } else if (error.request) {
             // 请求发送成功，但没有收到响应
             Message.error('请求超时，请重试')
             } else {
             // 在设置请求时发⽣了⼀些失去，触发了错误（未知型错误）
             Message.error(`请求失败${error.message}`)
             }
            
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            /* 将本次请求的错误参数对象继续向后抛出，让接受响应的处理函数进行操作 */
            return Promise.reject(error)
     })
    
export default request