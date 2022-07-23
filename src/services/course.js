import request from '@/utils/request'
/* 分⻚查询课程信息 */
export const getQueryCourses = data =>{
    return request({
        method: 'POST',
        url: '/boss/course/getQueryCourses',
        data
    })
}

/* 课程上下架 */
export const changeState = params =>{
    return request({
        method: 'GET',
        url: '/boss/course/changeState',
        params
    })
}

/* 保存或者更改课程信息 */
export const saveOrUpdateCourse = data =>{
    return request ({
        method: 'POST',
        url:'/boss/course/saveOrUpdateCourse',
        data
    })
}

/* 上传图片 */
/* 我们可以通过 Axios 的请求配置项 onUploadProgress 进⾏进度监测，onUploadProgress 本质是
对 H5 的 xhr.upload.onprogress 的封装 */
export const uploadCourseImage = (data,onUploadProgress) =>{
    /* 接⼝要求的请求数据类型为：multipart/form-data 所以需要提交 FormData 数据对象 */
    return request({
        method: 'POST',
        url:'/boss/course/upload',
        data,
        /*  Axios 将 HTML5 新增的上传进度事件：progress */
        onUploadProgress
    })
}

/* 通过课程Id获取课程信息 */
export const getCourseById = courseId =>{
    return request({
        method:'GET',
        url: '/boss/course/getCourseById',
        params:{
            courseId
        }
    })
}
