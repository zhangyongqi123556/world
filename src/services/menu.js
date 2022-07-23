import request from '@/utils/request'

/* 获取编辑菜单页面信息 */
export const getEditMenuInfo = (id = -1) =>{
    return request({
        method: 'GET',
        url: '/boss/menu/getEditMenuInfo',
        params:{
            id
        }
    })
}

/* 添加菜单接口 */
export const createOrUpdataMenu = data =>{
    return request({
        method: 'POST',
        url: '/boss/menu/saveOrUpdate',
        data
    })
}

/* 获取所有菜单 */
export const getAllMenus = () =>{
    return request({
        method: 'GET',
        url: '/boss/menu/getAll',
    })
}

/* 删除菜单 */
export const deleteMenu = id =>{
    return request({
        method: 'DELETE',
        url: `/boss/menu/${id}`,
    })
}

/* 获取所有菜单并按层级展示（注意，这是菜单功能，保存到 menu.js 中） */
export const getMenuNodeList = () =>{
    return request({
        method: 'GET',
        url: '/boss/menu/getMenuNodeList'
    })
}

/* 给角色分配菜单 */
export const allocateRoleMenus = data =>{
    return request({
        method:'POST',
        url: '/boss/menu/allocateRoleMenus',
        data
    })
}

/* 获取⻆⾊拥有的菜单列表 */
export const getRoleMenus = roleId =>{
    return request({
        method: 'GET',
        /* url: `/boss/menu/getRoleMenus?roleId=${roleId}` */
        url:'/boss/menu/getRoleMenus',
        params: {
            roleId
        }
    })
}