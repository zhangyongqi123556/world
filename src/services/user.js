import request from "@/utils/request"
import qs from 'qs'


export const login = data =>{
    return request({
        method: 'POST',
        url: '/front/user/login',
        data: qs.stringify(data)
    })
}

/* 用户基本信息请求 */
export const getUserInfo = () =>{
    return request({
        method: 'GET',
        url: '/front/user/getInfo',
        /*在 header 中设置 Token 信息  */
/*         headers:{
            authorization: store.state.user.access_token
        } */
    })
}

/* 分⻚查询⽤户信息 - ⽤户管理 */
export const getUserPages = data => {
    return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data
     })
}

/* 封禁⽤户（服务端关闭了权限，⽆法进⾏实际操作，如报错忽略即可） */
export const forbidUser = userId => {
     return request({
     method: 'POST',
     url: '/boss/user/forbidUser',
     params: {
     userId
     }
     })
}