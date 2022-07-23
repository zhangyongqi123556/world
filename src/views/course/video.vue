<template>
  <div class="course-video">
    <el-card>
        <div slot="header">
            课程相关信息
        </div>
    <el-form>
        <el-form-item label="视频上传">
            <input ref="video-file" type="file">
        </el-form-item>
        <el-form-item label="封⾯上传">
            <input ref="image-file" type="file">
        </el-form-item>
        <el-form-item>
            <el-button 
            type="primary"
            @click="handleUpload">开始上传</el-button>
            <el-button @click="$router.push({
                name: 'course-section',
                params: {
                courseId
            }
            })">返回</el-button>
        </el-form-item>
    </el-form>
    </el-card>  
 </div>
</template>
<script>
import {
  aliyunImagUploadAddressAndAuth,
  aliyunVideoUploadAddressAndAuth,
  aliyunVideoTranscode,
  getAliyunTranscodePercent
} from '@/services/aliyun-upload'
import { async } from 'q';

export default {
  name: 'CourseVideo',
  props:{
    courseId:{
        type: [String, Number],
        required: true
    }
  },
  data() {
    return {
      uploader: null,
      imageURL: '',
      videoId: null,
      uploadPercent: 0,
      isUploadSuccess: false,
      isTranscodeSuccess: false
    };
  },
  created() {
    this.initUploader()
  },
  methods: {
     // 初始化上传对象
 initUploader () {
  // 官⽅示例：声明 AliyunUpload.Vod 初始化回调。
  this.uploader = new window.AliyunUpload.Vod({
 // 阿⾥账号ID，必须有值
  userId: '1618139964448548',
 // 上传到视频点播的地域，默认值为'cn-shanghai'，//eu-central1，ap-southeast-1
  region: '',
 // 分⽚⼤⼩默认1 MB，不能⼩于100 KB
  artSize: 1048576,
 // 并⾏上传分⽚个数，默认5
  parallel: 5,
 // ⽹络原因失败时，重新上传次数，默认为3
  retryCount: 3,
 // ⽹络原因失败时，重新上传间隔时间，默认为2秒
  retryDuration: 2,
 // 开始上传
  onUploadstarted: async uploadInfo =>{
      /* console.log('onUploadstarted', uploadInfo) */
      /* 1. 声明变量存储得到上传凭证 */
      let uploadAddressAndAuth = null
      /* 2.根据 isImage 检测上传⽂件类型  */
      if (uploadInfo.isImage){
        const { data } = await getAliyunImagUploadAddressAndAuth()
        if(data.code === '000000'){
          /*  3. data.data 即为凭证信息组成的对象 */
          uploadAddressAndAuth = data.data
          /*5. 保存图⽚地址，给视频接⼝使⽤ */
          this.imageURL = uploadAddressAndAuth.imageURL
          this.videoId = data.data.videoId
        }
      }else{
          /* 4. 观察 uploadInfo 数据，根据请求参数名设置参数  
          - 由于视频接⼝要求传⼊封⾯图⽚地址 imageUrl，所以必须先发图再发视频*/
          const { data } = await getAliyunVideoUploadAddressAndAuth({
            fileName: uploadInfo.file.name,
            imageUrl: this.imageURL
          })
          if(data.code ==='000000'){
            /* 6. 存储凭证 图⽚与视频上传的区别在于图⽚存在 imageId，视频为 videoId，其他相同*/
            uploadAddressAndAuth = data.data
          }
      }
      /* ⼆、设置凭证 */
       this.uploader.setUploadAuthAndAddress(
        uploadInfo,
        uploadAddressAndAuth.uploadAuth,
        uploadAddressAndAuth.uploadAddress,
        uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId
 )

 },
 // ⽂件上传成功
  onUploadSucceed: function (uploadInfo) {
    console.log('onUploadSucceed', uploadInfo)
 },
 // ⽂件上传失败
  onUploadFailed: function (uploadInfo, code, message) {
     console.log('onUploadFailed', uploadInfo, code, message)
 },
 // ⽂件上传进度，单位：字节
 onUploadProgress: (uploadInfo, totalSize, loadedPercent) => {
    console.log('onUploadProgress', uploadInfo, totalSize,loadedPercent)
    /* 只对视频上传进度进⾏监测即可 */
    if (!uploadInfo.isImage){
      this.uploadPercent = Math.floor(loadedPercent * 100)
    }
 },
 // 上传凭证超时
  onUploadTokenExpired: function (uploadInfo) {
    console.log('onUploadTokenExpired', uploadInfo)
 },
 // 全部⽂件上传结束
  onUploadEnd: async uploadInfo =>{
    this.isUploadSuccess = true
    /* console.log('onUploadEnd', uploadInfo) */
    const { data } = await aliyunVideoTranscode({
          lessonId: this.$route.query.lessonId,
          coverImageUrl: this.imageURL,
          fileName: this.$refs['video-file'].files[0].name,
          fileId: this.videoId
    })
    if (data.code === '000000'){
      /* 转码开始后，需要轮询转码进度 */
      const timer = setInterval(async () =>{
        const { data } = getAliyunTranscodePercent(this.$route.query.lessonId)
        if(data === 100){
          /* 当上传进度为 100，停⽌定时器，并进⾏提示 */
          this.isTranscodeSuccess = true
          clearInterval(timer)
          this.$message.success('转码成功')
        }
      },1000)
    }
 }
 })
 },
  handleUpload (){
    /* 点击上传时重置状态信息 */
    this.isTranscodeSuccess = false
    this.isUploadSuccess = false
    this.uploadPercent = 0
    /* 获取上传的⽂件（视频、图⽚） */
    const videoFile = this.$refs['video-file'].files[0]
    const imageFile = this.$refs['image-file'].files[0]
     // 将⽂件添加到上传列表
    const uploader = this.uploader
    // - ⽂档示例：uploader.addFile(event.target.files[i], null, null, null, paramData)
    uploader.addFile(imageFile)
    uploader.addFile(videoFile)
     // 开始上传
     // - 开始上传后，上⾯的⽂件回按添加的顺序依次上传
     // - 这时会触发 onUploadStarted 事件
     uploader.startUpload()
  }
  
}
  
};
</script>

<style lang='less' scoped>

</style>